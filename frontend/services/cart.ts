import * as api from "@/lib/api";

export async function addCartItemService(data: {
  product_id: string;
  quantity?: number;
  weight?: number;
}) {
  const { response } = await api.addCartItem(data);
  return response;
}

export async function getCartService() {
  const data = await api.getCart();
  return data;
}

export async function updateCartItemService(id: string, data: any) {
  const response = await api.updateCartItem(id, data);
  return response;
}

export async function removeCartItemService(id: string) {
  const data = await api.removeCartItem(id);
  return data;
}
