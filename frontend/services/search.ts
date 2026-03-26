import { apiFetch, ApiResponse } from "./api";
import { Product } from "@/types/product";

export async function searchProducts(
  search_query: string,
  limit = 20,
  offset = 0,
): Promise<ApiResponse<Product[]>> {
  return apiFetch<Product[]>("/search/products", {
    method: "POST",
    body: JSON.stringify({
      search_query,
      limit,
      offset,
    }),
  });
}
