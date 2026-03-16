import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const PriceSkeleton = () => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        width: 100, // Largura aproximada de um preço
        height: 24, // Altura do texto do preço
        backgroundColor: "#E0E0E0",
        borderRadius: 6,
      }}
    />
  );
};
