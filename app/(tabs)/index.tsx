import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import debounce from "lodash.debounce";

import { getProducts, searchProducts } from "@/services/products";
import { Product } from "@/types/product";
import { styles } from "../../styles/home.styles";
import { useCart } from "@/context/CartContext";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  { id: "1", name: "Whey", icon: "shaker-outline" },
  { id: "2", name: "Creatina", icon: "dumbbell" },
  { id: "3", name: "Granola", icon: "bowl-mix-outline" },
  { id: "4", name: "Sementes", icon: "seed-outline" },
  { id: "5", name: "Cereais", icon: "barley" },
];

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMaxScore, setSearchMaxScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();

  // 🔹 Load inicial (vitrine)
  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
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
        if (!query.trim()) {
          setSearchResults([]);
          setSearchLoading(false);
          return;
        }

        setSearchLoading(true);
        const results = await searchProducts(query);

        setSearchResults(results.products);
        setSearchMaxScore(results.maxScore);
        setSearchLoading(false);
      }, 350),
    [],
  );

  useEffect(() => {
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

  const normalizeText = (text?: string) => {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // 🔹 Função para Primeira Letra Maiúscula
  const capitalizeFirstLetter = (text?: string) => {
    if (!text) return "";
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  // 🔥 LÓGICA FINAL DE EXIBIÇÃO
  const displayedProducts = useMemo(() => {
    // 1️⃣ Se estiver buscando → usar resultado do banco
    if (searchQuery.trim()) {
      // 🔴 Busca irrelevante
      if (searchMaxScore < 0.45) {
        return allProducts.slice(0, 6);
      }

      return searchResults;
    }

    // 2️⃣ Se categoria selecionada → filtrar localmente
    if (selectedCategory) {
      const query = normalizeText(selectedCategory);
      return allProducts
        .filter((p) => normalizeText(p.name).includes(query))
        .slice(0, 10);
    }

    // 3️⃣ Caso padrão → vitrine inicial
    return allProducts.slice(0, 6);
  }, [searchQuery, searchResults, selectedCategory, allProducts]);

  const randomOffers = useMemo(() => {
    if (searchQuery.trim()) return [];

    const displayedIds = displayedProducts.map((p) => p.id);
    const available = allProducts.filter((p) => !displayedIds.includes(p.id));

    return [...available].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [allProducts, displayedProducts, searchQuery]);

  const handleAddAndNavigate = async (product: Product) => {
    await addToCart({
      nome: product.name,
      tipo: "UNITARIO",
      total: product.price,
      qtd_desc: "1 un",
      qtd_numerica: 1,
      image_url: product.image_url,
    });
    router.push("/cart");
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
          onPress={() => handleAddAndNavigate(item)}
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
                {/* CATEGORIAS - só se não estiver buscando */}
                {!searchQuery.trim() && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitleText}>Categorias</Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.categoriesContainer}
                    >
                      {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.name;

                        return (
                          <TouchableOpacity
                            key={cat.id}
                            style={styles.categoryItem}
                            onPress={() =>
                              setSelectedCategory(isActive ? null : cat.name)
                            }
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
                  </>
                )}

                {/* RESULTADOS */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleText}>
                    {searchQuery.trim()
                      ? `Resultados para "${searchQuery}"`
                      : selectedCategory
                        ? `Destaques em ${selectedCategory}`
                        : "Produtos em Destaque"}
                  </Text>
                </View>

                {searchQuery.trim() && searchMaxScore < 0.45 && (
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

                {searchLoading ? (
                  <ActivityIndicator size="small" color="#E31837" />
                ) : (
                  <FlatList
                    data={displayedProducts}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.productGridRow}
                    contentContainerStyle={styles.productGridContainer}
                    ListEmptyComponent={
                      <Text style={{ textAlign: "center", margin: 20 }}>
                        Nenhum produto encontrado.
                      </Text>
                    }
                  />
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
                            onPress={() => handleAddAndNavigate(offer)}
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
