import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('home')
  async getHomeCatalog() {
    const result = await this.productsService.getHomeCatalog();
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':id/similar')
  async getSimilar(@Param('id') id: string) {
    return this.productsService.findSimilar(id);
  }

  @Get('/category/:id')
  async findCategoryProducts(
    @Param('id') id: string,
    @Query('limit') limit = '30',
    @Query('offset') offset = '0',
  ) {
    return this.productsService.findCategoryProducts(
      id,
      Number(limit),
      Number(offset),
    );
  }
}
