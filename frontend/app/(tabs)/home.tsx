import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
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
import SearchBar from "@/components/SearchBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const { addToCart } = useCart();
  const [refreshing, setRefreshing] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [categoryLimit] = useState(15);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const [categoryLoadingMore, setCategoryLoadingMore] = useState(false);
  const [userName, setUserName] = useState<string>("");
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

  useEffect(() => {
    const getCachedName = async () => {
      try {
        const name = await AsyncStorage.getItem("@hema_user_name");
        if (name) {
          // Pega apenas o primeiro nome para ficar mais amigável
          setUserName(name.split(" ")[0]);
        }
      } catch (e) {
        console.error("Erro ao buscar nome no cache", e);
      }
    };
    getCachedName();
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
    const trimmed = searchQuery.trim();

    setSearchEmbedding(null);
    setSearchOffset(0);
    setHasMore(true);

    // 🔥 Se começou a digitar → desativa categoria
    if (trimmed.length > 0 && activeCategory) {
      setActiveCategory(null);
      setCategoryOffset(0);
      setCategoryHasMore(true);
    }

    if (trimmed.length > 0) {
      setUiLoading(true);
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

  const isFiltering = searchQuery.trim().length > 0 || !!activeCategory;
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
    if (!isFiltering) return [];

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

  const loadMoreCategory = async () => {
    if (!activeCategory || !categoryHasMore) return;

    try {
      setCategoryLoadingMore(true);

      const nextOffset = categoryOffset + categoryLimit;

      const products = await fetchCategoryProducts(
        activeCategory,
        categoryLimit,
        nextOffset,
      );

      setSearchResults((prev) => {
        const combined = [...prev, ...products];
        const unique = new Map();

        combined.forEach((item) => {
          unique.set(item.id, item);
        });

        return Array.from(unique.values());
      });

      setCategoryOffset(nextOffset);
      setCategoryHasMore(products.length === categoryLimit);
    } finally {
      setCategoryLoadingMore(false);
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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      // 🔹 Modo categoria
      if (activeCategory) {
        const products = await fetchCategoryProducts(activeCategory);

        setSearchResults(products);

        setCategoryCache((prev) => ({
          ...prev,
          [activeCategory]: products,
        }));

        setHasMore(false); // categoria não tem paginação (ainda)
        return;
      }

      // 🔹 Modo busca
      if (searchQuery.trim()) {
        setSearchOffset(0);
        setHasMore(true);
        setSearchEmbedding(null);

        await executeSearch(searchQuery, 0);
        return;
      }

      // 🔹 Modo default (home)
      const data = await getHomeProducts(10, 0);
      setAllProducts(data);
    } catch (error) {
      console.error("Erro no refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: searchOpen ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [searchOpen]);

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
            style={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* TÍTULO */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 13,
                    opacity: 0.75,
                    marginBottom: 4,
                  }}
                >
                  Bem-vindo
                </Text>

                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 24,
                    fontWeight: "700",
                  }}
                  numberOfLines={1}
                >
                  {userName || "Hema Cereais"}
                </Text>
              </View>

              {/* SEARCH */}
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                expanded={searchOpen}
                onExpand={() => setSearchOpen(true)}
                onCollapse={() => setSearchOpen(false)}
                onSubmit={() => Keyboard.dismiss()}
              />
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
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={["#E31837"]}
                    tintColor="#E31837"
                  />
                }
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

                          if (activeCategory === cat.name) {
                            setActiveCategory(null);
                            setSearchResults([]);
                            setCategoryOffset(0);
                            setCategoryHasMore(true);
                            return;
                          }

                          setUiLoading(true);
                          setActiveCategory(cat.name);
                          setSearchQuery("");
                          setCategoryOffset(0);

                          try {
                            const products = await fetchCategoryProducts(
                              cat.name,
                              categoryLimit,
                              0,
                            );

                            setSearchResults(products);
                            setCategoryHasMore(
                              products.length === categoryLimit,
                            );
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
                            size={40}
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

                {/* MOSTRAR MAIS - CATEGORIA */}
                {activeCategory && categoryHasMore && (
                  <TouchableOpacity
                    style={{ marginVertical: 20, alignItems: "center" }}
                    disabled={categoryLoadingMore}
                    onPress={loadMoreCategory}
                  >
                    {categoryLoadingMore ? (
                      <ActivityIndicator size="small" color="#E31837" />
                    ) : (
                      <Text style={{ color: "#E31837", fontWeight: "bold" }}>
                        Mostrar mais
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {/* MOSTRAR MAIS - BUSCA */}
                {!activeCategory && searchQuery.trim() && hasMore && (
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
                {randomOffers.length > 0 && (
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
