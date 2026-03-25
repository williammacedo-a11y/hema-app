import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('orders')
@UseGuards(SupabaseAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. O "Checkout": Transforma o carrinho/seleção em um pedido oficial
  @Post('checkout')
  createOrder(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const userId = req['user'].sub;
    return this.ordersService.createOrder(userId, dto);
  }

  @Post(':id/pay')
  payOrder(@Req() req: Request, @Body() order_id: string, paymentData: any) {
    const userId = req['user'].sub;
    return this.ordersService.confirmAndPayOrder(userId, order_id, paymentData);
  }

  // 2. Histórico: Lista todos os pedidos do usuário logado
  @Get('my-orders')
  getUserOrders(@Req() req: Request) {
    const userId = req['user'].sub;
    return this.ordersService.findAllByUser(userId);
  }

  // 3. Detalhes: Pega um pedido específico (importante validar se o pedido pertence ao user)
  @Get(':id')
  getOrderDetails(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].sub;
    return this.ordersService.findOne(userId, id);
  }

  // 4. Cancelamento: Fluxo de interrupção do pedido
  @Patch(':id/cancel')
  cancelOrder(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].sub;
    return this.ordersService.cancelOrder(userId, id);
  }
}
