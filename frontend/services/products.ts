import { Product, CategoryCatalog } from "../types/product";

export async function getHomeCatalog(): Promise<CategoryCatalog[]> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_URL = `https://${BASE_URL}/products/home`;
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erro na requisição para a url: ${API_URL}`);
    }

    const data = await response.json();
    return data as CategoryCatalog[];
  } catch (error) {
    console.error("Erro ao buscar catálogo do backend:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_URL = `https://${BASE_URL}/products/${id}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) return null;

    const data = await response.json();
    return data as Product;
  } catch (error) {
    console.error("Erro ao buscar detalhes do produto:", error);
    return null;
  }
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_URL = `https://${BASE_URL}/products/category/${category}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) return [];

    const data = await response.json();
    return data as Product[];
  } catch (error) {
    console.error("Erro ao buscar produtos da categoria:", error);
    return [];
  }
}

export async function getSimilarProducts(id: string): Promise<Product[]> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_URL = `https://${BASE_URL}/products/${id}/similar`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) return [];

    const data = await response.json();
    return data as Product[];
  } catch (error) {
    console.error("Erro ao buscar similares:", error);
    return [];
  }
}
