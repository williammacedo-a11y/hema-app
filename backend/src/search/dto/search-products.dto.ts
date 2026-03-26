import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class SearchProductsDto {
  @IsString()
  @IsNotEmpty({ message: 'O termo de busca não pode estar vazio' })
  search_query: string;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}
