export class CreateOrderDto {
  address_id: string;
  items: Array<{
    product_id: string;
    quantity?: number;
    weight?: number;
  }>;
}
