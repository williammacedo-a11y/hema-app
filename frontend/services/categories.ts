import { searchProducts } from "./products";
import { CATEGORY_EMBEDDINGS } from "@/constants/CategoryEmbeddings";
import { Product } from "@/types/product";

export const CATEGORIES = [
  { id: "1", name: "Whey", icon: "shaker" }, // ainda n
  { id: "2", name: "Creatina", icon: "arm-flex" },
  { id: "3", name: "Snacks e Barras", icon: "food-apple-outline" },
  { id: "4", name: "Cereais e Grãos", icon: "barley" },
  { id: "5", name: "Pastas e Cremes", icon: "peanut-outline" },
  { id: "6", name: "Vitaminas", icon: "pill-multiple" },
  { id: "7", name: "Pré-Treinos", icon: "flash-outline" },
  { id: "8", name: "Colágenos", icon: "molecule" },
  { id: "9", name: "Sementes", icon: "seed" },
  { id: "10", name: "Chás e Ervas", icon: "tea" },
  { id: "11", name: "Temperos", icon: "shaker" },
  { id: "12", name: "Veganos", icon: "leaf-circle-outline" },
];

export async function fetchCategoryProducts(
  categoryName: string,
  limit = 6,
  offset = 0,
): Promise<Product[]> {
  const embedding = CATEGORY_EMBEDDINGS[categoryName];

  const result = await searchProducts(categoryName, limit, offset, embedding);

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
