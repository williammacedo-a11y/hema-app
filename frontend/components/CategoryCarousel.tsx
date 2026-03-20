import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { CategoryBadgesService } from "@/services/category";
import { styles } from "@/styles/category.badge.styles";

const categoryOrder = [
  "Whey",
  "Creatina",
  "Snacks e Barras",
  "Pré-Treinos",
];

export function CategoryCarousel() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await CategoryBadgesService.getCategories();

        const sortedData = [...data].sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.name);
          const indexB = categoryOrder.indexOf(b.name);

          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });

        setCategories(sortedData);
      } catch (error) {
        console.error("Erro ao carregar categorias no carrossel:", error);
      } finally {
        setLoading(false);
      }
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
