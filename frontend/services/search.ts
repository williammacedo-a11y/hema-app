import { Product } from "@/types/product";

export async function searchProducts(
  search_query: string,
  limit = 20,
  offset = 0,
): Promise<Product[]> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_URL = `https://${BASE_URL}/search/products`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search_query,
        limit,
        offset,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    return data as Product[];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}
