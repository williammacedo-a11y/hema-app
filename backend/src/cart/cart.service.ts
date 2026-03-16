import { Injectable } from '@nestjs/common';
import { AddCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { supabase } from 'src/lib/supabase';

@Injectable()
export class CartService {
  async addItem(userId: string, dto: AddCartItemDto) {
    const { product_id, quantity, weight } = dto;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .maybeSingle();

    if (productError || !product) {
      throw new Error('Produto não encontrado');
    }

    if (product.type === 'unit' && !quantity) {
      throw new Error('Quantidade é obrigatória para produtos unitários');
    }

    if (product.type === 'weight' && !weight) {
      throw new Error('Peso é obrigatório para produtos por peso');
    }

    // 3️⃣ buscar ou criar carrinho
    let { data: cart } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: cartError } = await supabase
        .from('carts')
        .insert({
          user_id: userId,
          total_price: 0,
        })
        .select()
        .maybeSingle();

      if (cartError) throw new Error('Falha ao criar carrinho');
      cart = newCart;
    }

    // 4️⃣ verificar se item já existe
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existingItem) {
      const newQuantity =
        product.type === 'unit'
          ? existingItem.quantity + (quantity || 0)
          : null;

      const newWeight =
        product.type === 'weight' ? existingItem.weight + (weight || 0) : null;

      let updatedPrice = 0;
      if (product.type === 'unit') {
        updatedPrice = product.price;
      } else {
        // Correção do erro aqui (usando o newWeight que já está seguro)
        updatedPrice = (product.price_per_kg / 1000) * (newWeight || 0);
      }

      await supabase
        .from('cart_items')
        .update({
          quantity: newQuantity,
          weight: newWeight,
          price: updatedPrice,
        })
        .eq('id', existingItem.id);
    } else {
      let initialPrice = 0;
      if (product.type === 'unit') {
        initialPrice = product.price;
      } else {
        // Correção do erro aqui: adicionando o fallback (weight || 0)
        initialPrice = (product.price_per_kg / 1000) * (weight || 0);
      }

      await supabase.from('cart_items').insert({
        cart_id: cart.id,
        product_id,
        quantity: quantity || null,
        weight: weight || null,
        price: initialPrice,
      });
    }

    await this.recalculateCart(cart.id);

    return {
      success: true,
      cart_id: cart.id,
    };
  }

  async getCart(userId: string) {
    // 1️⃣ buscar carrinho do usuário
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) {
      throw new Error('Erro ao buscar carrinho');
    }

    if (!cart) {
      return {
        cart: null,
        items: [],
        total_price: 0,
      };
    }

    // 2️⃣ buscar itens + produto
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(
        `
      id,
      quantity,
      weight,
      price,
      product:products (
        id,
        name,
        type,
        image_url,
        price,
        price_per_kg
      )
    `,
      )
      .eq('cart_id', cart.id);

    if (itemsError) {
      throw new Error(
        'Erro ao buscar itens do carrinho: ' + itemsError.message,
      );
    }

    return {
      cart,
      items: items ?? [],
      total_price: cart.total_price,
    };
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const { data: item } = await supabase
      .from('cart_items')
      .select('*, product:products(*)') // Precisamos do produto para recalcular o preço
      .eq('id', itemId)
      .maybeSingle();

    if (!item) throw new Error('Item não encontrado');

    const { data: cart } = await supabase
      .from('carts')
      .select('user_id')
      .eq('id', item.cart_id)
      .maybeSingle();

    if (!cart || cart.user_id !== userId) {
      throw new Error('Item não pertence ao usuário');
    }

    let newPrice = item.price;
    const product = item.product;

    if (dto.quantity !== undefined && product.type === 'unit') {
      newPrice = product.price;
    } else if (dto.weight !== undefined && product.type === 'weight') {
      newPrice = (product.price_per_kg / 1000) * (dto.weight || 0);
    }

    await supabase
      .from('cart_items')
      .update({
        ...dto,
        price: newPrice,
      })
      .eq('id', itemId);

    await this.recalculateCart(item.cart_id);

    return { success: true };
  }

  async removeItem(userId: string, itemId: string) {
    const { data: item } = await supabase
      .from('cart_items')
      .select('id, cart_id')
      .eq('id', itemId)
      .maybeSingle();

    if (!item) {
      throw new Error('Item não encontrado');
    }

    const { data: cart } = await supabase
      .from('carts')
      .select('user_id')
      .eq('id', item.cart_id)
      .maybeSingle();

    if (!cart || cart.user_id !== userId) {
      throw new Error('Item não pertence ao usuário');
    }

    await supabase.from('cart_items').delete().eq('id', itemId);

    await this.recalculateCart(item.cart_id);

    return { success: true };
  }

  async recalculateCart(cartId: string) {
    const { data: items } = await supabase
      .from('cart_items')
      .select('*, product:products(type)') // Precisamos saber o tipo
      .eq('cart_id', cartId);

    const total = (items ?? []).reduce((acc, item) => {
      // 🔴 CORREÇÃO 4: Lógica de Soma
      if (item.product.type === 'unit' && item.quantity) {
        // Se for unidade, salvamos o preço base. Então Total = Base * Qtd
        return acc + item.price * item.quantity;
      }

      if (item.product.type === 'weight' && item.weight) {
        // Se for peso, o 'item.price' já é o valor FINAL calculado ((kg/1000) * peso)
        // Então não multiplicamos por nada, só somamos.
        return acc + item.price;
      }

      return acc;
    }, 0);

    await supabase
      .from('carts')
      .update({ total_price: total })
      .eq('id', cartId);
  }
}
