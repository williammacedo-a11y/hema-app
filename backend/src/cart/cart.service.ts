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
      .single();

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
      .single();

    // 4️⃣ criar carrinho se não existir
    if (!cart) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert({
          user_id: userId,
          total_price: 0,
        })
        .select()
        .single();

      cart = newCart;
    }

    // 5️⃣ verificar se item já existe
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', product_id)
      .single();

    let price = 0;

    if (product.type === 'unit') {
      price = product.price;
    } else {
      price = product.price_per_gram * product.weight;
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
    };
  }

  getCart() {
    return `This action returns a cart`;
  }

  updateItem(id: string, updateCartDto: UpdateCartItemDto) {
    return `This action updates a #${id} cart`;
  }

  removeItem(id: string) {
    return `This action removes a #${id} cart`;
  }
}
