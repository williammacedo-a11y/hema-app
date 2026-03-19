import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class SearchService {
  async searchProducts(
    searchQuery: string,
    limitCount: number = 20,
    offsetCount: number = 0,
  ) {
    const supabaseUrl =
      'https://popkqrorbtubrmyomzix.supabase.co/rest/v1/rpc/search_products';
    const supabaseKey = process.env.SUPABASE_API_KEY || '';

    try {
      const response = await fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          search_query: searchQuery,
          limit_count: limitCount,
          offset_count: offsetCount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('ERRO DO SUPABASE:', errorData); // Isso ajuda a debugar se der erro de novo
        throw new HttpException(errorData, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro interno ao buscar produtos no Supabase',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
