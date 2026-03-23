import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "@/util/toast";

import { getProductsByCategory } from "@/services/products";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { styles } from "@/styles/category.styles";
import { useCart } from "@/context/CartContext";

const LIMIT = 30;

export default function CategoryScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadInitialProducts() {
      if (!id) return;
      setLoading(true);

      const data = await getProductsByCategory(id, LIMIT, 0);
      setProducts(data);
      setOffset(0);

      // Se a API retornou menos do que 20, significa que não tem mais páginas.
      setHasMore(data.length === LIMIT);
      setLoading(false);
    }
    loadInitialProducts();
  }, [id]);

  const onRefresh = async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      const data = await getProductsByCategory(id, LIMIT, 0);
      setProducts(data);
      setOffset(0);
      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreProducts = async () => {
    if (!hasMore || loadingMore || !id) return;

    setLoadingMore(true);
    const nextOffset = offset + LIMIT;

    const data = await getProductsByCategory(id, LIMIT, nextOffset);

    setProducts((prev) => [...prev, ...data]);
    setOffset(nextOffset);

    setHasMore(data.length === LIMIT);
    setLoadingMore(false);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const payload = {
        product_id: product.id,
        price: product.type === "unit" ? product.price : product.price_per_kg,
        ...(product.type === "unit" ? { quantity: 1 } : { weight: 50 }),
      };

      Toast.show({
        type: "success",
        text1: "Adicionado ao carrinho!",
        text2: `${product.name} foi adicionado com sucesso.`,
      });
      await addItem(payload);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar",
        text2: "Não foi possível adicionar este item.",
      });
      console.error("Erro na categoria:", error);
    }
  };

  const renderFooter = () => {
    if (!hasMore && products.length > 0) return null;

    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        {loadingMore ? (
          <ActivityIndicator size="small" color="#E31837" />
        ) : (
          hasMore &&
          products.length > 0 && (
            <TouchableOpacity
              onPress={loadMoreProducts}
              style={{
                backgroundColor: "#F5F5F5",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#EAEAEA",
              }}
            >
              <Text
                style={{ color: "#E31837", fontWeight: "600", fontSize: 14 }}
              >
                Mostrar Mais
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    );
  };

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

      {/* AQUI ENTRA O SKELETON */}
      {loading ? (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <View key={i} style={styles.skeletonGridItem}>
                <ProductCardSkeleton />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* SUA FLATLIST REAL AQUI */
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={products}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E31837"]}
              tintColor="#E31837"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item.id}`)}
                onAdd={() => handleAddToCart(item)}
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
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
}
