import { supabase } from "@/services/auth";
const API_URL = `https://${process.env.EXPO_PUBLIC_API_URL}`;

export async function getToken() {
  // Pede a sessão atual diretamente pro gerente oficial (Supabase)
  const { data: { session } } = await supabase.auth.getSession();
  
  // Retorna o token se existir, ou null
  return session?.access_token || null;
}

export async function addCartItem(data: {
  product_id: string;
  quantity?: number;
  weight?: number;
}) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao adicionar item no carrinho");
  }

  return res.json();
}

export async function getCart() {
  const token = await getToken();

  const res = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(res.toString());
  }

  return await res.json();
}

export async function updateCartItem(id: string, data: any) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/cart/items/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar item");
  }

  return res.json();
}

export async function removeCartItem(id: string) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/cart/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao remover item");
  }

  return res.json();
}
