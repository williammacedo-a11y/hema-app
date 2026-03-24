interface ProcessPaymentInput {
  payment_method: string;
  total_price: number;
  delivery_fee: number;
  order_id: string;
}

interface ProcessPaymentResult {
  orderStatus: string;
  paymentStatus: string;
}

export async function processPayment(
  input: ProcessPaymentInput,
): Promise<ProcessPaymentResult> {
  const { payment_method, total_price, order_id } = input;

  switch (payment_method) {
    case 'cash':
      console.log(`[PAYMENT] Order ${order_id} → Dinheiro → fluxo offline`);

      return {
        orderStatus: 'pending',
        paymentStatus: 'waiting_cash',
      };

    case 'pix':
      console.log(
        `[PAYMENT] Order ${order_id} → PIX → chamar Mercado Pago (QR Code)`,
      );

      return {
        orderStatus: 'waiting_payment',
        paymentStatus: 'pending',
      };

    case 'card':
      console.log(
        `[PAYMENT] Order ${order_id} → Cartão → chamar Mercado Pago (Token)`,
      );

      return {
        orderStatus: 'waiting_payment',
        paymentStatus: 'pending',
      };

    default:
      throw new Error('Método de pagamento inválido');
  }
}
