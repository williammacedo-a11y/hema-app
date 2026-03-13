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
  const { response } = await api.getCart();
  return response;
}

export async function updateCartItemService(id: string, data: any) {
  const { response } = await api.updateCartItem(id, data);
  return response;
}

export async function removeCartItemService(id: string) {
  const { response } = await api.removeCartItem(id);
  return response;
}
