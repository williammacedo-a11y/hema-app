import { supabase } from "./auth";

const API_URL = `https://${process.env.EXPO_PUBLIC_API_URL}/orders`;

const getHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.session?.access_token}`,
  };
};

type PaymentMethod = 'pix' | 'card' | 'cash';
export const OrdersService = {
  async createOrder({
    address_id,
    payment_method,
  }: {
    address_id?: string | null;
    payment_method: PaymentMethod;
  }) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          address_id: address_id || null,
          payment_method: payment_method,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao finalizar o pedido.");
      }

      return data;
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      throw error;
    }
  },

  // 2. Listar Histórico de Pedidos
  async getUserOrders() {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/my-orders`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar histórico de pedidos.");
      }

      return data;
    } catch (error: any) {
      console.error("Erro ao buscar histórico:", error);
      throw error;
    }
  },

  // 3. Ver Detalhes de um Pedido Específico
  async getOrderDetails(orderId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar detalhes do pedido.");
      }

      return data;
    } catch (error: any) {
      console.error(`Erro ao buscar detalhes do pedido ${orderId}:`, error);
      throw error;
    }
  },

  // 4. Cancelar Pedido
  async cancelOrder(orderId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/${orderId}/cancel`, {
        method: "PATCH",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Se for o erro 409 (Conflict), a mensagem do backend já vem mastigada
        throw new Error(data.message || "Erro ao cancelar o pedido.");
      }

      return data;
    } catch (error: any) {
      console.error(`Erro ao cancelar pedido ${orderId}:`, error);
      throw error;
    }
  },
};
