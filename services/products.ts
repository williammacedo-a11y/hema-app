import { Product } from "../types/product";
import { supabase } from "./supabase";

export async function getHomeProducts(
  limit = 6,
  offset = 0,
): Promise<Product[]> {
  const { data, error } = await supabase.rpc("get_home_products", {
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw error;

  const mapped: Product[] = (data ?? []).map((item: any) => {
    const rawPrice = item.preço
      ? String(item.preço)
          .replace(/[^\d,]/g, "")
          .replace(",", ".")
      : "0";

    return {
      id: item.id,
      name: item.nome,
      price: parseFloat(rawPrice) || 0,
      quantity: Number(item.quantidade) || 0,
      description: item.descricao ?? "",
      image_url: item.url_imagem ?? "",
      createdAt: item.created_at,
      score: 0,
    };
  });

  return mapped;
}

type SearchResult = {
  products: Product[];
  maxScore: number;
  embedding: number[];
};

export async function searchProducts(
  query: string,
  limit = 15,
  offset = 0,
  embedding?: number[] | null,
): Promise<SearchResult> {
  if (!query.trim()) {
    return { products: [], maxScore: 0, embedding: [] };
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/hybrid-search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ query, limit, offset, embedding }),
    },
  );

  if (!response.ok) {
    console.error("Erro na Edge Function");
    return { products: [], maxScore: 0, embedding: [] };
  }

  const data = await response.json();

  const mapped: Product[] = (data.products ?? []).map((item: any) => {
    const rawPrice = item.preço
      ? String(item.preço)
          .replace(/[^\d,]/g, "")
          .replace(",", ".")
      : "0";

    return {
      id: item.id,
      name: item.nome,
      price: parseFloat(rawPrice) || 0,
      quantity: Number(item.quantidade) || 0,
      description: item.descricao ?? "",
      image_url: item.url_imagem ?? "",
      createdAt: item.created_at,
      score: item.score ?? 0,
    };
  });

  const maxScore = mapped.length > 0 ? (mapped[0].score ?? 0) : 0;

  return {
    products: mapped,
    maxScore,
    embedding: data.embedding,
  };
}
