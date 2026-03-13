import { Injectable } from '@nestjs/common';
import { AddCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { supabase } from 'src/lib/supabase';

@Injectable()
export class CartService {
  async addItem(userId: string, dto: AddCartItemDto) {
    const { product_id, quantity, weight } = dto;

    // 1️⃣ buscar produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .maybeSingle();

    if (productError || !product) {
      throw new Error('Produto não encontrado');
    }

    // 2️⃣ validar tipo
    if (product.type === 'unit' && !quantity) {
      throw new Error('Quantidade é obrigatória para produtos unitários');
    }

    if (product.type === 'weight' && !weight) {
      throw new Error('Peso é obrigatório para produtos por peso');
    }

    // 3️⃣ buscar carrinho
    let { data: cart } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // 4️⃣ criar carrinho se não existir
    if (!cart) {
      const { data: newCart, error: cartError } = await supabase
        .from('carts')
        .insert({
          user_id: userId,
          total_price: 0,
        })
        .select()
        .maybeSingle();

      if (cartError) {
        console.error('Erro criando carrinho:', cartError);
        throw new Error('Falha ao criar carrinho');
      }
      cart = newCart;
    }

    if (!cart) {
      throw new Error('Carrinho não encontrado');
    }

    // 5️⃣ verificar se item já existe
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', product_id)
      .maybeSingle();

    let price = 0;

    if (product.type === 'unit') {
      price = product.price;
    } else {
      price = product.price_per_kg * product.weight;
    }

    // 6️⃣ atualizar item existente
    if (existingItem) {
      const newQuantity =
        product.type === 'unit'
          ? existingItem.quantity + quantity
          : existingItem.quantity;

      const newWeight =
        product.type === 'weight'
          ? existingItem.weight + weight
          : existingItem.weight;

      await supabase
        .from('cart_items')
        .update({
          quantity: newQuantity,
          weight: newWeight,
          price,
        })
        .eq('id', existingItem.id);
    }

    // 7️⃣ inserir novo item
    else {
      await supabase.from('cart_items').insert({
        cart_id: cart.id,
        product_id,
        quantity: quantity || null,
        weight: weight || null,
        price,
      });
    }

    // 8️⃣ recalcular total
    const { data: items } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id);

    const itemsSafe = items ?? [];

    const total = itemsSafe.reduce((acc, item) => {
      if (item.quantity) {
        return acc + item.price * item.quantity;
      }

      if (item.weight) {
        return acc + item.price;
      }

      return acc;
    }, 0);

    await supabase
      .from('carts')
      .update({ total_price: total })
      .eq('id', cart.id);

    return {
      success: true,
      cart_id: cart.id,
      total_price: total,
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
      .select('*')
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

    await supabase.from('cart_items').update(dto).eq('id', itemId);

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
      .select('*')
      .eq('cart_id', cartId);

    const total = (items ?? []).reduce((acc, item) => {
      if (item.quantity) {
        return acc + item.price * item.quantity;
      }

      if (item.weight) {
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
