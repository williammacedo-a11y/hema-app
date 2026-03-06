import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, DimensionValue } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles/home.styles";

interface ShimmerProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
}

const Shimmer = ({ width, height, borderRadius = 0 }: ShimmerProps) => {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(translateX.value, [-1, 1], [-300, 300]),
      },
    ],
  }));

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#EAEAEA",
        overflow: "hidden",
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={["#EAEAEA", "#F5F5F5", "#EAEAEA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export default function SkeletonCard() {
  return (
    <View style={styles.productCard}>
      {/* Imagem do Produto */}
      <Shimmer width="100%" height={150} borderRadius={0} />

      <View style={[styles.productInfo, { marginTop: 10 }]}>
        {/* Título */}
        <Shimmer width="80%" height={14} />

        {/* Espaçador */}
        <View style={{ marginBottom: 8 }} />

        {/* Subtítulo/Preço */}
        <Shimmer width="40%" height={14} />

        <View style={{ marginBottom: 12 }} />

        {/* Botão ou rodapé do card */}
        <Shimmer width="100%" height={32} borderRadius={0} />
      </View>
    </View>
  );
}

// 4. A Lista que renderiza os cards
export const SkeletonGrid = () => (
  <FlatList
    data={[1, 2, 3, 4, 5, 6]}
    renderItem={() => <SkeletonCard />}
    keyExtractor={(item) => item.toString()}
    numColumns={2}
    scrollEnabled={false}
    columnWrapperStyle={styles.productGridRow}
    contentContainerStyle={styles.productGridContainer}
  />
);
