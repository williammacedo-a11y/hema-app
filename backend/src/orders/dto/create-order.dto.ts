import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  address_id?: string;

  @IsString()
  @IsNotEmpty({ message: 'O método de pagamento é obrigatório' })
  @IsIn(['credit_card', 'pix', 'cash'], {
    message: 'Método de pagamento inválido. Escolha: credit_card, pix ou cash',
  })
  payment_method: string;
}
