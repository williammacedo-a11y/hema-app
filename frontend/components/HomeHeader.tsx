import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "@/styles/home.styles";

interface Props {
  userName: string;
}

export function HomeHeader({ userName }: Props) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.searchPlaceholder} activeOpacity={0.8}>
        <Text style={styles.searchPlaceholderText}>Buscar produtos...</Text>
      </TouchableOpacity>
    </View>
  );
}
