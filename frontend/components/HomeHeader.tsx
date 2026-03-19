import React, { useState, useRef } from "react";
import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/styles/home.styles";

export function HomeHeader({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState("");
  const timeoutRef = useRef<any>(null);

  const handleTextChange = (text: string) => {
    setValue(text);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearch(text);
    }, 500);
  };

  const handleClear = () => {
    setValue("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch(""); // Limpa a busca
  };

  const handleForceSearch = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch(value); // Força a busca imediata ao clicar na lupa
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.searchBar}>
        <TouchableOpacity onPress={handleForceSearch} style={styles.iconButton}>
          <MaterialCommunityIcons name="magnify" size={24} color="#999" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={handleTextChange}
          returnKeyType="search"
          onSubmitEditing={handleForceSearch}
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
