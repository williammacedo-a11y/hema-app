import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Product } from "@/types/product";
import { styles } from "@/styles/home.styles";

interface Props {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
}

export function ProductCard({ product, onPress, onAdd }: Props) {
  const getDisplayPrice = () => {
    const formatted = (product.price ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    if (product.type === "kg" && product.price_per_kg) {
      return `${product.price_per_kg.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /kg`;
    }
    return formatted;
  };

  const capitalizeName =
    product.name?.charAt(0).toUpperCase() +
    product.name?.slice(1).toLowerCase();

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
        />
      ) : (
        <View style={[styles.productImage, styles.imageFallback]}>
          <MaterialCommunityIcons
            name="image-off-outline"
            size={32}
            color="#ccc"
          />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {capitalizeName}
        </Text>
        <Text style={styles.productPrice}>{getDisplayPrice()}</Text>

        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>ADICIONAR</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
