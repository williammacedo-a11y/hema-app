import React, { useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Toast } from "@/util/toast";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "@/styles/home.styles";
import { useHomeData } from "@/hooks/useHomeData";
import { HomeHeader } from "@/components/HomeHeader";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import { searchProducts } from "@/services/search";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

const SEARCH_LIMIT = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { catalog, refreshing, onRefresh } = useHomeData();
  const { addItem } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isSearchingMore, setIsSearchingMore] = useState(false);
  const [searchOffset, setSearchOffset] = useState(0);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);

  const handleAddToCart = async (product: Product) => {
    try {
      const isKg =
        product.price_per_kg !== null && product.price_per_kg !== undefined;
      const isUnit = product.type === "unit" || !isKg;

      const payload = {
        product_id: product.id,
        price: isUnit ? product.price : product.price_per_kg,
        ...(isUnit ? { quantity: 1 } : { weight: 50 }),
      };

      Toast.show({
        type: "success",
        text1: "Produto adicionado ao carrinho!",
        text2: `${product.name} foi salvo.`,
      });

      await addItem(payload);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Não foi possível adicionar o item.",
      });
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchProducts(query, SEARCH_LIMIT, 0);
      setSearchResults(results);
      setSearchOffset(0);
      setHasMoreSearch(results.length === SEARCH_LIMIT);
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMoreSearchResults = async () => {
    if (!hasMoreSearch || isSearchingMore || !searchQuery.trim()) return;

    try {
      setIsSearchingMore(true);
      const nextOffset = searchOffset + SEARCH_LIMIT;
      const results = await searchProducts(
        searchQuery,
        SEARCH_LIMIT,
        nextOffset,
      );

      setSearchResults((prev) => [...prev, ...results]);
      setSearchOffset(nextOffset);
      setHasMoreSearch(results.length === SEARCH_LIMIT);
    } catch (err) {
      console.error("Erro ao carregar mais resultados:", err);
    } finally {
      setIsSearchingMore(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#E31837" />

      <HomeHeader onSearch={handleSearch} />

      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // Se quiser que o ícone de loading "suma" ou fique discreto:
            colors={refreshing && catalog ? ["transparent"] : ["#E31837"]}
            tintColor={refreshing && catalog ? "transparent" : "#E31837"}
          />
        }
      >
        <CategoryCarousel />

        {/* 1. LOADING DA BUSCA (SKELETON EM GRADE) */}
        {isSearching ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={styles.skeletonGridItem}>
                <ProductCardSkeleton />
              </View>
            ))}
          </View>
        ) : searchQuery.trim() !== "" ? (
          /* 2. EXIBIÇÃO DOS RESULTADOS DA BUSCA */
          <View style={styles.sectionContainer}>
            {/* Cabeçalho de Feedback da Busca */}
            {searchResults.length > 0 &&
            (searchResults[0].similarity_score ?? 0) < 0.3 ? (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.sectionTitle}>
                  Poxa, não encontramos "{searchQuery}"
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#666",
                    marginHorizontal: 18,
                    marginTop: -10,
                    marginBottom: 10,
                  }}
                >
                  Mas separamos algumas sugestões parecidas para você:
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              <Text style={styles.sectionTitle}>
                Resultados para "{searchQuery}"
              </Text>
            ) : null}

            {/* Caso não encontre NADA */}
            {searchResults.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="magnify-close"
                  size={48}
                  color="#CCC"
                />
                <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
              </View>
            ) : (
              <>
                {/* Grade de Produtos */}
                <View style={styles.gridContainer}>
                  {searchResults.map((product, index) => (
                    <View
                      key={`${product.id}-${index}`}
                      style={styles.gridItem}
                    >
                      <ProductCard
                        product={product}
                        onPress={() =>
                          router.push({
                            pathname: "/product/[id]",
                            params: { id: product.id },
                          })
                        }
                        onAdd={() => handleAddToCart(product)}
                      />
                    </View>
                  ))}
                </View>

                {/* 🚀 O BOTÃO VOLTOU AQUI: */}
                {hasMoreSearch && (
                  <View style={{ paddingVertical: 30, alignItems: "center" }}>
                    {isSearchingMore ? (
                      <ActivityIndicator size="small" color="#E31837" />
                    ) : (
                      <TouchableOpacity
                        onPress={loadMoreSearchResults}
                        style={styles.loadMoreButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.loadMoreText}>Mostrar Mais</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        ) : !catalog || refreshing ? (
          <View style={{ marginTop: 20 }}>
            {[1, 2].map((row) => (
              <View key={row}>
                <View
                  style={{
                    height: 20,
                    width: 150,
                    backgroundColor: "#F0F0F0",
                    marginLeft: 18,
                    marginBottom: 15,
                    borderRadius: 4,
                  }}
                />
                <View style={styles.skeletonRow}>
                  {[1, 2, 3].map((i) => (
                    <ProductCardSkeleton key={i} isCarousel={true} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* 3. CONTEÚDO REAL DO CATÁLOGO (Só aparece quando catalog existe e refreshing é false) */
          catalog?.map((category) => {
            if (!category.products || category.products.length === 0)
              return null;

            return (
              <View key={category.id} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{category.name}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/category/[id]",
                        params: { id: category.id, name: category.name },
                      })
                    }
                  >
                    <Text style={{ color: "#E31837", fontWeight: "bold" }}>
                      Ver todos
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                >
                  {category.products.map((product, index) => (
                    <View
                      key={product.id}
                      style={{
                        marginRight:
                          index === category.products.length - 1 ? 0 : 12,
                      }}
                    >
                      <ProductCard
                        product={product}
                        isCarousel={true}
                        onPress={() =>
                          router.push({
                            pathname: "/product/[id]",
                            params: { id: product.id },
                          })
                        }
                        onAdd={() => handleAddToCart(product)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
