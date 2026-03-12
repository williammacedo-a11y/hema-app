import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { getProductsByCategory } from "@/services/products";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";
import { styles } from "@/styles/category.styles";

export default function CategoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      if (!id) return;
      setLoading(true);
      const data = await getProductsByCategory(id);
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          {/* O vermelho vibrante dá um bom destaque na tela de carregamento */}
          <ActivityIndicator size="large" color="#E31837" />
        </View>
      ) : (
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item.id}`)}
                onAdd={() => console.log("Adicionado", item.name)}
                isGrid={true}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                Poxa, ainda não temos produtos na categoria "{name}".
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
