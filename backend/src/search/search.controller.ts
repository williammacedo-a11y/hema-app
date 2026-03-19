import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';

export class SearchProductsDto {
  search_query: string;
  limit?: number;
  offset?: number;
}

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('products')
  async searchProducts(@Body() body: SearchProductsDto) {
    return this.searchService.searchProducts(
      body.search_query,
      body.limit,
      body.offset,
    );
  }
}
