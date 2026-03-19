import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { cardStyles } from "@/styles/productCard.styles"; // Ajuste o caminho do seu estilo se precisar
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
  isCarousel?: boolean; // Propriedade nova para controlar a largura!
}

export function ProductCard({
  product,
  onPress,
  onAdd,
  isCarousel = false,
}: ProductCardProps) {
  // LÓGICA DO PREÇO: Verifica se é por peso ou unidade
  const isKg =
    product.price_per_kg !== null && product.price_per_kg !== undefined;
  const displayPrice = isKg ? product.price_per_kg : product.price;
  const unitLabel = isKg ? " /kg" : " /un";

  const formattedPrice = displayPrice
    ? displayPrice.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "R$ 0,00";

  return (
    <TouchableOpacity
      style={[
        cardStyles.productCard,
        isCarousel && cardStyles.carouselWidth, // Aplica a largura fixa só se for carrossel
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* IMAGEM OU PLACEHOLDER */}
      <View style={cardStyles.imageContainer}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={cardStyles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={cardStyles.imageFallback}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={32}
              color="#CCC"
            />
          </View>
        )}
      </View>

      {/* INFORMAÇÕES DO PRODUTO */}
      <View style={cardStyles.productInfo}>
        <View>
          <Text style={cardStyles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={cardStyles.productPrice}>
            {formattedPrice}
            <Text style={cardStyles.priceUnit}>{unitLabel}</Text>
          </Text>
        </View>

        <TouchableOpacity style={cardStyles.discreteAddButton} onPress={onAdd}>
          <Text style={cardStyles.discreteAddButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
