import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Product } from "@/types/product";
import { cardStyles as styles } from "@/styles/productCard.styles";

interface Props {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
  isGrid?: boolean;
}

export function ProductCard({
  product,
  onPress,
  onAdd,
  isGrid = false,
}: Props) {
  const getDisplayPrice = () => {
    const price = product.price ?? 0;
    const formatted = price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    if (product.type === "weight" && product.price_per_kg) {
      return `${product.price_per_kg.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /kg`;
    }
    return formatted;
  };

  const capitalizeName = product.name
    ? product.name.charAt(0).toUpperCase() + product.name.slice(1).toLowerCase()
    : "";

  const dynamicAspectRatio = isGrid
    ? product.id.length % 2 === 0
      ? 0.85
      : 1.1
    : 1;

  return (
    <TouchableOpacity
      style={[styles.productCard, !isGrid && styles.carouselWidth]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={[styles.productImage, { aspectRatio: dynamicAspectRatio }]}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageFallback}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={32}
              color="#ccc"
            />
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {capitalizeName}
        </Text>
        <Text style={styles.productPrice}>{getDisplayPrice()}</Text>
      </View>

      {/* Novo botão discreto no final do card */}
      <TouchableOpacity
        style={styles.discreteAddButton}
        onPress={onAdd}
        activeOpacity={0.7}
      >
        <Text style={styles.discreteAddButtonText}>+ Adicionar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
