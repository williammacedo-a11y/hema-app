import { apiFetch, ApiResponse } from "./api";

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

export async function getAddresses(): Promise<ApiResponse<Address[]>> {
  return apiFetch<Address[]>("/addresses", { method: "GET" });
}

export async function createAddress(
  data: Partial<Address>,
): Promise<ApiResponse<Address>> {
  return apiFetch<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(
  id: string,
  data: Partial<Address>,
): Promise<ApiResponse<Address>> {
  return apiFetch<Address>(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(id: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/addresses/${id}`, { method: "DELETE" });
}

export async function getAddressByCep(
  cep: string,
): Promise<
  ApiResponse<{
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  }>
> {
  const cleanCep = cep.replace(/\D/g, "");
  return apiFetch(`/addresses/cep/${cleanCep}`, { method: "GET" });
}
