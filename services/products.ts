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
