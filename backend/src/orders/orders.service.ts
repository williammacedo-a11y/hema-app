import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { supabase } from 'src/lib/supabase';
import { calculateDeliveryFee } from '../utils/delivery.util';
import { processPayment } from '../payments/payment.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(private readonly cartService: CartService) {}
  // Criar o registro na 'orders' e os itens na 'order_items'
  async createOrder(userId: string, dto: CreateOrderDto) {
    try {
      // 1. Buscar o carrinho do usuário
      const cartData = await this.cartService.getCart(userId);
      if (!cartData.cart || cartData.items.length === 0) {
        throw new HttpException(
          'Carrinho vazio ou não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { cart, items: cartItems } = cartData;
      const isDelivery = !!dto.address_id;

      // 3. Lógica de Frete e Validações de Regras de Negócio
      let deliveryFee = 0;
      if (isDelivery) {
        const { data: address, error: addressError } = await supabase
          .from('addresses')
          .select('city')
          .eq('id', dto.address_id)
          .single();

        if (addressError || !address) {
          throw new HttpException(
            'Endereço não encontrado.',
            HttpStatus.BAD_REQUEST,
          );
        }

        deliveryFee = calculateDeliveryFee(address.city);

        if (deliveryFee === -1) {
          throw new HttpException(
            'Não realizamos entregas para esta região. Selecione a opção "Retirar na loja".',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // 4. Calcular os subtotais dos itens
      let calculatedTotal = 0;

      const orderItemsToInsert = cartItems.map((item: any) => {
        const product = item.product;
        const isUnit = product.type === 'unit';
        const price = isUnit ? product.price : product.price_per_kg;

        const subtotal = isUnit
          ? price * (item.quantity || 1)
          : price * ((item.weight || 0) / 1000);

        calculatedTotal += subtotal;

        return {
          product_id: product.id,
          product_name: product.name,
          product_price: price,
          quantity: isUnit ? item.quantity : null,
          weight: !isUnit ? item.weight : null,
          subtotal: Number(subtotal.toFixed(2)),
        };
      });

      const finalTotalPrice = Number(
        (calculatedTotal + deliveryFee).toFixed(2),
      );

      // 6. Insere o pedido principal (Order)
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          address_id: dto.address_id || null,
          status: 'pending', // Chumbado: acabou de nascer, tá pendente
          payment_status: 'pending',
          total_price: finalTotalPrice,
          delivery_fee: deliveryFee,
          payment_method: dto.payment_method,
        })
        .select()
        .single();

      if (orderError || !newOrder) {
        console.error('Erro ao gerar a order principal:', orderError);
        throw new HttpException(
          'Erro interno ao gerar pedido.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // 7. Prepara e insere os itens do pedido com retry
      const itemsWithOrderId = orderItemsToInsert.map((item) => ({
        ...item,
        order_id: newOrder.id,
      }));

      let itemsInserted = false;
      let attempts = 0;
      const maxRetries = 2;

      while (attempts <= maxRetries && !itemsInserted) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsWithOrderId);

        if (!itemsError) {
          itemsInserted = true;
        } else {
          attempts++;
          console.warn(
            `[Order ${newOrder.id}] Falha ao inserir itens (Tentativa ${attempts}/${maxRetries + 1}):`,
            itemsError,
          );
          if (attempts <= maxRetries)
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Rollback
      if (!itemsInserted) {
        console.error(
          `🚨 Iniciando ROLLBACK: Deletando a order ${newOrder.id} órfã...`,
        );
        await supabase.from('orders').delete().eq('id', newOrder.id);

        throw new HttpException(
          'Tivemos um problema de conexão ao finalizar seu pedido. Por favor, tente novamente.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // 5. Gera o status inicial baseado na forma de pagamento
      const paymentResult = await processPayment({
        payment_method: dto.payment_method,
        total_price: finalTotalPrice,
        delivery_fee: deliveryFee,
        order_id: newOrder.id,
      });

      // 8. 🔴 Limpa o carrinho APENAS se for dinheiro
      if (dto.payment_method === 'cash') {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id);
        await supabase
          .from('carts')
          .update({ total_price: 0 })
          .eq('id', cart.id);
      }

      return {
        message: 'Pedido criado com sucesso!',
        order_id: newOrder.id,
        status: paymentResult.orderStatus,
        total_price: finalTotalPrice,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Erro interno ao processar checkout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar todos os pedidos simplificados para a lista do App
  async findAllByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          id,
          product_name,
          quantity,
          weight,
          subtotal
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // Mais recentes primeiro

    if (error) {
      throw new HttpException(
        'Erro ao buscar histórico',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data;
  }

  // Buscar detalhes de um pedido + seus itens (Join)
  async findOne(userId: string, orderId: string) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_price,
            quantity,
            weight,
            subtotal
          ),
          addresses (
            label,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            zip_code
          )
        `,
        )
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error || !order) {
        throw new HttpException(
          'Pedido não encontrado ou você não tem permissão para acessá-lo.',
          HttpStatus.NOT_FOUND,
        );
      }

      return order;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(`Erro ao buscar detalhes do pedido ${orderId}:`, error);
      throw new HttpException(
        'Erro interno ao buscar os detalhes do pedido',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Lógica de cancelamento (Update de Status)
  async cancelOrder(userId: string, orderId: string) {
    try {
      // 1. Buscar o pedido para checar o status e garantir que pertence ao usuário
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      // Se não achar, ou é um ID inválido ou o usuário tá tentando cancelar o pedido de outra pessoa
      if (fetchError || !order) {
        throw new HttpException(
          'Pedido não encontrado ou acesso negado.',
          HttpStatus.NOT_FOUND,
        );
      }

      // 2. Verificar se o status atual permite cancelamento
      // Deixei em um array porque no futuro você pode adicionar 'aguardando_pagamento' aqui
      const cancelableStatuses = ['pending'];

      if (!cancelableStatuses.includes(order.status)) {
        throw new HttpException(
          `Não é possível cancelar este pedido pois ele já está em processamento. (Status: ${order.status})`,
          HttpStatus.CONFLICT,
        );
      }

      // 3. Atualizar status para 'cancelled'
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', userId);

      if (updateError) {
        console.error(`Erro ao cancelar pedido ${orderId}:`, updateError);
        throw new HttpException(
          'Erro ao processar o cancelamento do pedido.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        message: 'Pedido cancelado com sucesso.',
        order_id: orderId,
        new_status: 'cancelled',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(`Erro inesperado ao cancelar pedido ${orderId}:`, error);
      throw new HttpException(
        'Erro interno ao cancelar o pedido.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Função interna para ser usada pelo Webhook de Pagamento amanhã
  async updateStatus(orderId: string, status: string) {
    // TODO: Atualizar status do pedido (ex: 'paid', 'shipped')
  }

  async confirmAndPayOrder(userId: string, orderId: string, paymentData: any) {
    // 1. Busca o pedido pelo ID
    // 2. Envia os dados (token do cartão gerado pelo app, ou pede geração de QR code) pro Mercado Pago
    // 3. Se o Mercado Pago aprovar:
    /* Pseudo-código:
  const mpResult = await mercadoPagoService.charge(...);
  if (mpResult.status === 'approved') {
     await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId);
     
     // AGORA SIM APAGA O CARRINHO
     const cart = await getUserCart(userId);
     await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  }
  */
  }
}
