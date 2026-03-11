import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "@/styles/home.styles";

interface Props {
  userName: string;
}

export function HomeHeader({ userName }: Props) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.welcomeText}>Bem-vindo</Text>
      <Text style={styles.userName} numberOfLines={1}>
        {userName || "Hema Cereais"}
      </Text>

      {/* PLACEHOLDER DA BUSCA */}
      <TouchableOpacity style={styles.searchPlaceholder} activeOpacity={0.8}>
        <Text style={styles.searchPlaceholderText}>Buscar produtos...</Text>
      </TouchableOpacity>
    </View>
  );
}
