import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { CategoryBadgesService } from "@/services/category";
import { styles } from "@/styles/category.badge.styles";

const categoryOrder = ["Whey", "Creatina", "Snacks e Barras", "Pré-Treinos"];

export function CategoryCarousel() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);

      const response = await CategoryBadgesService.getCategories();

      if (response.success && response.data) {
        const sortedData = [...response.data].sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.name);
          const indexB = categoryOrder.indexOf(b.name);

          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });

        setCategories(sortedData);
      } else {
        console.log(
          "Erro ao carregar categorias no carrossel:",
          response.message,
        );
      }

      setLoading(false);
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#E31837" />
      </View>
    );
  }

  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.badge}
            onPress={() =>
              router.push({
                pathname: "/category/[id]",
                params: { id: item.id, name: item.name },
              })
            }
          >
            <Text style={styles.badgeText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
