import { Product } from "../types/product";
import { supabase } from "./supabase";

function formatTitleCase(text: string) {
  if (!text) return "";

  const exceptions = [
    "de",
    "da",
    "do",
    "das",
    "dos",
    "com",
    "sem",
    "e",
    "em",
    "para",
  ];

  return text
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (!word) return "";

      if (index > 0 && exceptions.includes(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("produtos_hema_cereais").select(`
      id,
      name:nome,
      price:preço,
      quantity:quantidade,
      description:descricao,
      image_url:url_imagem,
      createdAt:created_at
    `);

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }

  if (!data) return [];

  return data.map((item: any) => {
    const rawPrice = item.price
      ? String(item.price)
          .replace(/[^\d,-]/g, "")
          .replace(",", ".")
      : "0";

    return {
      ...item,
      name: formatTitleCase(item.name),

      price: parseFloat(rawPrice) || 0,
      quantity: parseInt(item.quantity, 10) || 0,
      image_url: item.image_url || "",
      description: formatTitleCase(item.description),
    };
  });
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

  // Resultados de pesquisa ordenados por score de similaridade com a query
  // console.log("\n\nQuery:", query);
  // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  // data?.forEach((item: any, index: number) => {
  //   console.log(`#${index} | ${item.nome ?? item.name} | score: ${item.score}`);
  // });

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
