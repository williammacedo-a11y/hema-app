import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class AddCartItemDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  product_id: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'A quantidade deve ser de no mínimo 1' })
  quantity?: number;

  @IsNumber()
  @IsOptional()
  @Min(10, { message: 'O peso deve ser de no mínimo 50 gramas' })
  weight?: number;
}
