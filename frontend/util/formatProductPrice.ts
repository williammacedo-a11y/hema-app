import { Product } from "@/types/product";

export function getProductPrice(product: Product) {
  if (product.type === "unit") {
    return product.price;
  }

  if (product.type === "weight") {
    return product.price_per_kg;
  }

  return null;
}

export function getProductUnitLabel(product: Product) {
  if (product.type === "unit") {
    return "unidade";
  }

  if (product.type === "weight") {
    return "kg";
  }

  return "";
}

export function formatProductPrice(product: Product) {
  const value = getProductPrice(product);

  if (!value) return "";

  const formatted = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return `${formatted} / ${getProductUnitLabel(product)}`;
}
