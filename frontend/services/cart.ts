export interface AddCartItemDTO {
  product_id: string;
  quantity?: number;
  weight?: number;
}

const API_URL = `https://${process.env.EXPO_PUBLIC_API_URL}/cart`;

export async function addCartItem(dto: AddCartItemDTO) {
  const response = await fetch("/cart/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição para a url: ${API_URL}`);
  }
  return response.json();
}

// export async function getCart() {
//   const response = await api.get("/cart");
//   return response.data;
// }

// export async function updateCartItem(id: string, data: any) {
//   const response = await api.patch(`/cart/items/${id}`, data);
//   return response.data;
// }

// export async function removeCartItem(id: string) {
//   const response = await api.delete(`/cart/items/${id}`);
//   return response.data;
// }
