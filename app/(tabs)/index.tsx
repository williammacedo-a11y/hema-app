import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useCart } from "@/context/CartContext";
import { getHomeProducts, searchProducts } from "@/services/products";
import { Product } from "@/types/product";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { styles } from "../../styles/home.styles";
import SkeletonCard from "@/components/SkeletonCard";
import {
  CATEGORIES,
  fetchCategoryProducts,
  preloadPriorityCategories,
} from "@/services/categories";

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchMaxScore, setSearchMaxScore] = useState<number | null>(null);
  const [searchOffset, setSearchOffset] = useState(0);
  const [searchLimit] = useState(15);
  const [hasMore, setHasMore] = useState(true);
  const [searchEmbedding, setSearchEmbedding] = useState<number[] | null>(null);
  const [uiLoading, setUiLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const [categoryCache, setCategoryCache] = useState<Record<string, Product[]>>(
    {},
  );

  useEffect(() => {
    async function load() {
      try {
        const data = await getHomeProducts(10, 0);
        setAllProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 🔹 Debounce search
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (searchEmbedding) return;
        if (!query.trim()) {
          setSearchResults([]);
          setSearchOffset(0);
          setHasMore(true);
          return;
        }

        setSearchLoading(true);
        setHasMore(true);

        await executeSearch(query, 0);

        setSearchLoading(false);
      }, 800),
    [],
  );

  useEffect(() => {
    setSearchEmbedding(null);
    setSearchOffset(0);
    setHasMore(true);

    if (searchQuery.trim()) {
      setUiLoading(true); // 🔥 AQUI
    }

    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  const formatPrice = (price?: number) =>
    (price ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // 🔹 Função para Primeira Letra Maiúscula
  const capitalizeFirstLetter = (text?: string) => {
    if (!text) return "";
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  useEffect(() => {
    const load = async () => {
      const priority = ["Whey", "Creatina", "Cereais e Grãos"];

      const cache = await preloadPriorityCategories(priority);

      setCategoryCache(cache);
    };

    load();
  }, []);

  // 🔥 LÓGICA FINAL DE EXIBIÇÃO
  const displayedProducts = useMemo(() => {
    if (activeCategory) {
      return searchResults;
    }

    if (searchQuery.trim()) {
      if (searchMaxScore !== null && searchMaxScore < 0.45) {
        return allProducts.slice(0, 6);
      }
      return searchResults;
    }

    return allProducts;
  }, [activeCategory, searchQuery, searchResults, searchMaxScore, allProducts]);
  
  const randomOffers = useMemo(() => {
    if (searchQuery.trim()) return [];

    const displayedIds = displayedProducts.map((p) => p.id);
    const available = allProducts.filter((p) => !displayedIds.includes(p.id));

    return [...available].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [allProducts, displayedProducts, searchQuery]);

  const handleAddToCart = async (product: Product) => {
    try {
      Toast.show({
        type: "success",
        text1: "Produto adicionado com sucesso!",
        text2: "",
        position: "bottom",
        visibilityTime: 1500,
      });
      await addToCart({
        nome: product.name,
        tipo: "UNITARIO",
        total: product.price,
        qtd_desc: "1 un",
        qtd_numerica: 1,
        image_url: product.image_url,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar",
        text2: "Tente novamente.",
      });
    }
  };

  const executeSearch = async (query: string, offset = 0) => {
    try {
      if (offset === 0) {
        setSearchLoading(true);
      } else {
        setLoadingMore(true);
      }

      const result = await searchProducts(
        query,
        searchLimit,
        offset,
        offset === 0 ? null : searchEmbedding,
      );

      if (offset === 0) {
        setSearchMaxScore(result.maxScore ?? null);
      }

      // 🔥 Atualiza embedding só na primeira busca
      if (offset === 0 && result.embedding) {
        setSearchEmbedding(result.embedding);
      }

      // 🔥 Atualiza lista corretamente
      if (offset === 0) {
        setSearchResults(result.products);
      } else {
        setSearchResults((prev) => {
          const combined = [...prev, ...result.products];
          const uniqueMap = new Map();

          for (const item of combined) {
            uniqueMap.set(item.id, item);
          }

          return Array.from(uniqueMap.values());
        });
      }

      setSearchOffset(offset);

      if (result.products.length < searchLimit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Erro na busca",
        text2: "Não conseguimos carregar os produtos.",
        position: "bottom",
      });
    } finally {
      setSearchLoading(false);
      setLoadingMore(false);
      setUiLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      // 🔹 Correção da Navegação
      onPress={() => router.push(`/product/${item.id}`)}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImagePlaceholder}
        />
      ) : (
        // 🔹 Correção do Placeholder
        <View
          style={[
            styles.productImagePlaceholder,
            {
              backgroundColor: "#f0f0f0",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="image-off-outline"
            size={40}
            color="#ccc"
          />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {/* 🔹 Correção da Letra Maiúscula */}
          {capitalizeFirstLetter(item.name)}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>ADICIONAR</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#E31837" }}
      edges={["top"]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* Envolvendo tudo em um único View filho */}
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#E31837" />

          <View
            style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}
          >
            {/* LINHA SUPERIOR */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 14,
                    opacity: 0.85,
                  }}
                >
                  Bem-vindo
                </Text>
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 22,
                    fontWeight: "bold",
                  }}
                >
                  Hema Cereais
                </Text>
              </View>

              {/* Avatar */}
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: "#FFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#E31837", fontWeight: "bold" }}>HC</Text>
              </View>
            </View>

            {/* SEARCH */}
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#999"
                style={{ marginRight: 8 }}
              />

              <TextInput
                placeholder="Buscar produtos..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
                style={{
                  flex: 1,
                  fontSize: 14,
                }}
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    Keyboard.dismiss();
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#E31837" />
                <Text style={{ marginTop: 10, color: "#666" }}>
                  Carregando cereais...
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.container}
              >
                {/* CATEGORIAS */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleText}>Categorias</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesContainer}
                >
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.name;

                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={styles.categoryItem}
                        onPress={async () => {
                          Keyboard.dismiss();
                          setUiLoading(true);
                          setActiveCategory(cat.name);

                          if (categoryCache[cat.name]) {
                            setSearchResults(categoryCache[cat.name]);
                            setUiLoading(false);
                            return;
                          }

                          try {
                            const products = await fetchCategoryProducts(
                              cat.name,
                            );

                            setSearchResults(products);

                            setCategoryCache((prev) => {
                              const updated = {
                                ...prev,
                                [cat.name]: products,
                              };

                              return updated;
                            });
                          } finally {
                            setUiLoading(false);
                          }
                        }}
                      >
                        <View
                          style={[
                            styles.categoryCircle,
                            isActive && {
                              backgroundColor: "#E31837",
                              borderColor: "#E31837",
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={cat.icon as any}
                            size={24}
                            color={isActive ? "#FFF" : "#666"}
                          />
                        </View>
                        <Text style={styles.categoryText}>{cat.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* RESULTADOS */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleText}>
                    {searchQuery.trim()
                      ? `Resultados para "${searchQuery}"`
                      : "Produtos em Destaque"}
                  </Text>
                </View>

                {searchQuery.trim() &&
                  !searchLoading &&
                  searchMaxScore !== null &&
                  searchMaxScore < 0.45 && (
                    <View style={{ padding: 16 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Não encontramos "{searchQuery}"
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          textAlign: "center",
                          marginTop: 6,
                          color: "#666",
                        }}
                      >
                        Veja algumas sugestões abaixo:
                      </Text>
                    </View>
                  )}

                {uiLoading ? (
                  <FlatList
                    data={Array.from({ length: 6 })}
                    keyExtractor={(_, index) => `skeleton-${index}`}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.productGridRow}
                    renderItem={() => <SkeletonCard />}
                  />
                ) : (
                  <FlatList
                    data={displayedProducts}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.productGridRow}
                    contentContainerStyle={styles.productGridContainer}
                  />
                )}

                {searchQuery.trim() &&
                  !searchLoading &&
                  searchResults.length > 0 &&
                  hasMore && (
                    <TouchableOpacity
                      style={{ marginVertical: 20, alignItems: "center" }}
                      disabled={loadingMore}
                      onPress={() =>
                        executeSearch(searchQuery, searchOffset + searchLimit)
                      }
                    >
                      {loadingMore ? (
                        <ActivityIndicator size="small" color="#E31837" />
                      ) : (
                        <Text style={{ color: "#E31837", fontWeight: "bold" }}>
                          Mostrar mais
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}

                {/* OFERTAS - só fora do modo busca */}
                {!searchQuery.trim() && randomOffers.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitleText}>
                        Outras Ofertas
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.offersContainer}
                    >
                      {randomOffers.map((offer) => (
                        <TouchableOpacity
                          key={offer.id}
                          style={styles.offerCard}
                          onPress={() => router.push(`/product/${offer.id}`)}
                        >
                          {offer.image_url ? (
                            <Image
                              source={{ uri: offer.image_url }}
                              style={styles.offerImagePlaceholder}
                            />
                          ) : (
                            // 🔹 Correção do Placeholder
                            <View
                              style={[
                                styles.offerImagePlaceholder,
                                {
                                  backgroundColor: "#f0f0f0",
                                  justifyContent: "center",
                                  alignItems: "center",
                                },
                              ]}
                            >
                              <MaterialCommunityIcons
                                name="image-off-outline"
                                size={24}
                                color="#ccc"
                              />
                            </View>
                          )}
                          <Text style={styles.offerName} numberOfLines={1}>
                            {/* 🔹 Correção da Letra Maiúscula */}
                            {capitalizeFirstLetter(offer.name)}
                          </Text>
                          <Text style={styles.promoPriceText}>
                            {formatPrice(offer.price)}
                          </Text>

                          <TouchableOpacity
                            style={{
                              marginTop: 8,
                              backgroundColor: "#F0F0F0",
                              padding: 6,
                              borderRadius: 6,
                              alignItems: "center",
                            }}
                            onPress={() => handleAddToCart(offer)}
                          >
                            <Text
                              style={{
                                color: "#E31837",
                                fontSize: 10,
                                fontWeight: "bold",
                              }}
                            >
                              + ADICIONAR
                            </Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </>
                )}

                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
