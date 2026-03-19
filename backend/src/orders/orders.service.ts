import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { supabase } from 'src/lib/supabase'; // Importando o seu client!

@Injectable()
export class OrdersService {
  // Criar o registro na 'orders' e os itens na 'order_items'
  async createOrder(userId: string, dto: CreateOrderDto) {
    try {
      // 1. Buscar os produtos no banco para pegar os PREÇOS REAIS
      const productIds = dto.items.map((i) => i.product_id);

      // Usando o client do Supabase (muito mais limpo!)
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, price_per_kg, type')
        .in('id', productIds);

      if (productsError || !products || products.length === 0) {
        throw new HttpException(
          'Produtos enviados são inválidos ou não encontrados.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Calcular Totais e Preparar os Itens para Inserção
      let totalPrice = 0;
      const deliveryFee = 12.5; // Fixo por enquanto

      const orderItemsData = dto.items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) {
          throw new HttpException(
            `Produto ${item.product_id} não encontrado`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const isUnit = product.type === 'unit';
        const price = isUnit ? product.price : product.price_per_kg;

        // Se for unidade, multiplica pela quantia. Se for peso, divide por 1000 (assumindo gramas)
        const subtotal = isUnit
          ? price * (item.quantity || 1)
          : price * ((item.weight || 0) / 1000);

        totalPrice += subtotal;

        return {
          product_id: product.id,
          product_name: product.name,
          product_price: price,
          quantity: isUnit ? item.quantity || 1 : null,
          weight: !isUnit ? item.weight || 0 : null,
          subtotal: Number(subtotal.toFixed(2)),
        };
      });

      const finalTotalPrice = Number((totalPrice + deliveryFee).toFixed(2));

      // 3. Inserir na tabela 'orders' e RETORNAR o objeto criado
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          address_id: dto.address_id,
          status: 'pending_payment',
          total_price: finalTotalPrice,
          delivery_fee: deliveryFee,
        })
        .select() // Equivalente ao Prefer: return=representation
        .single(); // Garante que retorna apenas o objeto, não um array

      if (orderError || !newOrder) {
        console.error('Erro ao criar pedido:', orderError);
        throw new HttpException(
          'Erro ao criar o pedido principal',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // 4. Inserir os itens na tabela 'order_items' com o novo order_id
      const itemsToInsert = orderItemsData.map((item) => ({
        ...item,
        order_id: newOrder.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert); // Bulk insert nativo!

      if (itemsError) {
        console.error('Erro ao inserir itens:', itemsError);
        // Em um cenário ideal, se falhar aqui, você deveria deletar a order criada acima (Rollback manual)
        throw new HttpException(
          'Erro ao salvar os itens do pedido',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Tudo deu certo!
      return {
        message: 'Pedido criado com sucesso!',
        order_id: newOrder.id,
        status: newOrder.status,
        total_price: finalTotalPrice,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Erro interno ao criar pedido',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar todos os pedidos simplificados para a lista do App
  async findAllByUser(userId: string) {
    // TODO: Buscar na tabela 'orders' filtrando por user_id
    // Dica: Ordenar pelo 'created_at' decrescente
    return [];
  }

  // Buscar detalhes de um pedido + seus itens (Join)
  async findOne(userId: string, orderId: string) {
    // TODO: Buscar na 'orders' e fazer o join com 'order_items'
    // Importante: Validar se o orderId pertence ao userId enviado
    return {};
  }

  // Lógica de cancelamento (Update de Status)
  async cancelOrder(userId: string, orderId: string) {
    // TODO: 1. Verificar se o status atual permite cancelamento
    // TODO: 2. Atualizar status para 'cancelled'
    return { message: 'Pedido cancelado' };
  }

  // Função interna para ser usada pelo Webhook de Pagamento amanhã
  async updateStatus(orderId: string, status: string) {
    // TODO: Atualizar status do pedido (ex: 'paid', 'shipped')
  }
}
