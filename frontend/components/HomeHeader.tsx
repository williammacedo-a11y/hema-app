import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "@/styles/home.styles";

export function HomeHeader() {
  return (
    <View style={styles.headerContainer}>
      {/* Logo Redonda */}
      <Image
        source={require("@/assets/images/logo.jpg")}
        style={styles.logo}
        resizeMode="cover"
      />

      {/* Barra de Busca */}
      <TouchableOpacity style={styles.searchPlaceholder} activeOpacity={0.8}>
        <Text style={styles.searchPlaceholderText}>Buscar produtos...</Text>
      </TouchableOpacity>
    </View>
  );
}
