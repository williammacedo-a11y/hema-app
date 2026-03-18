import { supabase } from "./auth";

const API_URL = "https://" + process.env.EXPO_PUBLIC_API_URL + "/addresses";

export interface Address {
  id: string;
  label?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at?: string;
}

const getHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.session?.access_token}`,
  };
};

export async function getAddresses(): Promise<Address[]> {
  const res = await fetch(API_URL, {
    method: "GET",
    headers: await getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar endereços");
  }

  return res.json();
}

export async function createAddress(data: Partial<Address>): Promise<Address> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar endereço");
  }

  return res.json();
}

export async function updateAddress(
  id: string,
  data: Partial<Address>
): Promise<Address> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar endereço");
  }

  return res.json();
}

export async function deleteAddress(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar endereço");
  }
}

export async function getAddressByCep(
  cep: string
): Promise<{ street: string; neighborhood: string; city: string; state: string }> {
  const cleanCep = cep.replace(/\D/g, "");
  const res = await fetch(`${API_URL}/cep/${cleanCep}`, {
    method: "GET",
    headers: await getHeaders(),
  });

  if (!res.ok) {
    throw new Error("CEP inválido ou erro no servidor");
  }

  return res.json();
}
