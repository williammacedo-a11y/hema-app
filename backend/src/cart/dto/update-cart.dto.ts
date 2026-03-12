import { PartialType } from '@nestjs/mapped-types';
import { AddCartItemDto } from './create-cart.dto';

export class UpdateCartItemDto extends PartialType(AddCartItemDto) {
  quantity?: number;
  weight?: number;
}
