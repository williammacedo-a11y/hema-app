import { searchProducts } from "./products";
import { CATEGORY_EMBEDDINGS } from "@/constants/CategoryEmbeddings";
import { Product } from "@/types/product";

export const CATEGORIES = [
  // --- SUPLEMENTAÇÃO ---
  { id: "1", name: "Whey", icon: "shaker-outline" }, // Whey, Vegana, Albumina
  { id: "2", name: "Creatina", icon: "dumbbell" }, // O produto mais vendido do Brasil
  { id: "3", name: "Cereais e Grãos", icon: "barley" }, // Aveia, Granola, Quinoa, Psyllium
  { id: "4", name: "Pastas e Cremes", icon: "food-apple" }, // Pasta de amendoim (campeã de vendas)
  { id: "5", name: "Vitaminas", icon: "pill" }, // Vitamina D, Magnésio, Multivits
  { id: "6", name: "Pré-Treinos", icon: "lightning-bolt" }, // Beta-alanina, Cafeína, Termogênicos
  { id: "7", name: "Aminoácidos", icon: "molecule" }, // BCAA, Glutamina, EAA
  { id: "8", name: "Colágenos", icon: "shimmer" }, // Verisol, Hidrolisado (muita busca feminina)
  { id: "9", name: "Oleaginosas", icon: "nut" }, // Castanhas, Nozes, Amêndoas
  { id: "10", name: "Sementes", icon: "seed-outline" }, // Chia, Linhaça, Girassol
  { id: "11", name: "Chás e Ervas", icon: "leaf" }, // Chá Verde, Hibisco, Camomila
  { id: "12", name: "Temperos", icon: "silverware-variant" }, // Cúrcuma, Lemon Pepper, Páprica
  { id: "13", name: "Snacks e Barras", icon: "candy-outline" }, // Barrinhas de proteína, chips de coco
  { id: "14", name: "Veganos", icon: "sprout" }, // Categoria de nicho que cresce 20% ao ano
];

export async function fetchCategoryProducts(
  categoryName: string,
  limit = 6,
): Promise<Product[]> {
  
  const embedding = CATEGORY_EMBEDDINGS[categoryName];

  const result = await searchProducts(categoryName, limit, 0, embedding);

  return result.products;
}

export async function preloadPriorityCategories(
  priority: string[],
): Promise<Record<string, Product[]>> {
  const results = await Promise.all(
    priority.map((cat) => fetchCategoryProducts(cat, 6)),
  );

  const cache: Record<string, Product[]> = {};

  priority.forEach((cat, index) => {
    cache[cat] = results[index];
  });

  return cache;
}
