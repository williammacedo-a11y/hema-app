import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { cardStyles } from "@/styles/productCard.styles";

export function ProductCardSkeleton({ isCarousel = false }) {
  // Criamos a referência para a animação
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Definimos uma animação em loop de "vai e vem" (pulsação)
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerAnim]);

  // Estilo animado para aplicar nos blocos cinzas
  const animatedStyle = {
    opacity: shimmerAnim,
    backgroundColor: "#EBEBEB", // Um cinza um pouco mais moderno
  };

  return (
    <View
      style={[cardStyles.productCard, isCarousel && cardStyles.carouselWidth]}
    >
      {/* Imagem Animada */}
      <Animated.View style={[cardStyles.imageContainer, animatedStyle]} />

      <View style={cardStyles.productInfo}>
        <View>
          {/* Linha de Título 1 */}
          <Animated.View
            style={[
              {
                height: 14,
                borderRadius: 4,
                width: "90%",
                marginBottom: 6,
              },
              animatedStyle,
            ]}
          />
          {/* Linha de Título 2 */}
          <Animated.View
            style={[
              {
                height: 14,
                borderRadius: 4,
                width: "60%",
                marginBottom: 12,
              },
              animatedStyle,
            ]}
          />
          {/* Preço */}
          <Animated.View
            style={[
              {
                height: 20,
                borderRadius: 4,
                width: "40%",
              },
              animatedStyle,
            ]}
          />
        </View>

        {/* Botão Adicionar */}
        <Animated.View
          style={[
            {
              height: 32,
              borderRadius: 100,
              marginTop: 12,
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}
