import { Injectable } from '@nestjs/common';
import { supabase } from 'src/lib/supabase';

@Injectable()
export class ProductsService {
  async getHomeCatalog() {
    const targetCategories = [
      'Whey',
      'Creatina',
      'Snacks e Barras',
      'Vitaminas',
      'Pré-Treinos',
      'Veganos',
      'Chás e Ervas',
      'Colágenos',
      'Cereais e Grãos',
      'Sementes',
    ];

    const { data, error } = await supabase
      .from('categories')
      .select(
        `
      id,
      name,
      products (
        id,
        name,
        price,
        price_per_kg,
        image_url,
        type
      )
    `,
      )
      .in('name', targetCategories)
      .not('products.image_url', 'is', null)
      .limit(10, { foreignTable: 'products' })
      .order('name', { ascending: false });

    if (error) {
      throw new Error(`Erro Supabase: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Erro detalhado do Supabase:', error);
      throw new Error(`Erro Supabase: ${error.message}`);
    }

    if (error || !data) throw new Error('Produto não encontrado');

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      price: data.price,
      price_per_kg: data.price_per_kg,
      image_url: data.image_url,
    };
  }

  async findSimilar(productId: string) {
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, category_id')
      .eq('id', productId)
      .single();

    if (error) throw new Error(error.message);

    const { data, error: error2 } = await supabase
      .from('products')
      .select('id, name, price, price_per_kg, image_url, type')
      .eq('category_id', product.category_id)
      .neq('id', productId)
      .limit(10);

    if (error2) throw new Error(error2.message);

    return data;
  }

  async findCategoryProducts(categoryId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, price_per_kg, image_url, type')
      .eq('category_id', categoryId);

    if (error) throw new Error(error.message);

    return data;
  }
}
