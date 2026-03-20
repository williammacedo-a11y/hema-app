import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabase } from 'src/lib/supabase';

@Injectable()
export class CategoriesService {
  constructor() {}

  async findAll() {
    const { data, error } = await supabase
      .from('categories') 
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro Supabase Categories:', error);
      throw new InternalServerErrorException(
        'Erro ao buscar categorias no banco.',
      );
    }

    return data;
  }
}
