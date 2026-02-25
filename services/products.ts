import { supabase } from "./supabase";
import { Product } from "../types/product";

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

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/hybrid-search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ query }),
    },
  );

  if (!response.ok) {
    console.error("Erro na Edge Function");
    return [];
  }

  const data = await response.json();

  return (data ?? []).map((item: any) => {
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
    };
  });
}
