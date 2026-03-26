import { apiFetch, ApiResponse } from "./api";

export type PaymentMethod = "pix" | "credit_card" | "cash";

export const OrdersService = {
  async createOrder({
    address_id,
    payment_method,
  }: {
    address_id?: string | null;
    payment_method: PaymentMethod;
  }): Promise<ApiResponse<any>> {
    return apiFetch("/orders/checkout", {
      method: "POST",
      body: JSON.stringify({
        address_id: address_id || null,
        payment_method,
      }),
    });
  },

  // 2. Listar Histórico de Pedidos
  async getUserOrders(): Promise<ApiResponse<any>> {
    return apiFetch("/orders/my-orders", { method: "GET" });
  },

  // 3. Ver Detalhes de um Pedido Específico
  async getOrderDetails(orderId: string): Promise<ApiResponse<any>> {
    return apiFetch(`/orders/${orderId}`, { method: "GET" });
  },

  // 4. Cancelar Pedido
  async cancelOrder(orderId: string): Promise<ApiResponse<any>> {
    return apiFetch(`/orders/${orderId}/cancel`, { method: "PATCH" });
  },
};
