import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @UseGuards(SupabaseAuthGuard)
  addItem(@Req() req: Request, @Body() dto: AddCartItemDto) {
    const userId = req['user'].sub;

    return this.cartService.addItem(userId, dto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  getCart(@Req() req: Request) {
    const userId = req['user'].sub;
    return this.cartService.getCart(userId);
  }

  @Patch('items/:id')
  @UseGuards(SupabaseAuthGuard)
  updateItem(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    const userId = req['user'].sub;
    return this.cartService.updateItem(userId, id, dto);
  }

  @Delete('items/:id')
  @UseGuards(SupabaseAuthGuard)
  removeItem(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].sub;
    return this.cartService.removeItem(userId, id);
  }
}
