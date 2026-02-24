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
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getProducts } from "@/services/products";
import { Product } from "@/types/product";
import { styles } from "../../styles/home.styles";
import { useCart } from "@/context/CartContext";

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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();
  const { addToCart } = useCart();

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

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const normalizeText = (text?: string) => {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // 2. LÓGICA CORRIGIDA: Filtra apenas pelo NOME do produto
  const displayedProducts = useMemo(() => {
    if (!selectedCategory) {
      return allProducts.slice(0, 6);
    }

    const query = normalizeText(selectedCategory);
    return allProducts
      .filter((p) => {
        const nName = normalizeText(p.name);
        // Agora verifica apenas se a palavra da categoria está no TÍTULO
        return nName.includes(query);
      })
      .slice(0, 10);
  }, [allProducts, selectedCategory]);

  const randomOffers = useMemo(() => {
    const displayedIds = displayedProducts.map((p) => p.id);

    const availableForOffers = allProducts.filter(
      (p) => !displayedIds.includes(p.id),
    );

    return [...availableForOffers].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [allProducts, displayedProducts]);

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
      onPress={() =>
        router.push({
          pathname: "/product/[id]",
          params: {
            id: item.id,
            data: JSON.stringify(item),
          },
        })
      }
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImagePlaceholder}
        />
      ) : (
        <View style={styles.productImagePlaceholder} />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
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
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
          {/* BANNER */}
          <View style={styles.promoBanner}>
            <Text style={styles.promoTitle}>Promoção da Semana</Text>
            <Text style={styles.promoSubtitle}>
              Qualidade selecionada para você
            </Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Ver ofertas</Text>
            </TouchableOpacity>
          </View>

          {/* CATEGORIAS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleText}>Categorias</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text
                  style={{ color: "#E31837", fontSize: 12, fontWeight: "bold" }}
                >
                  Ver todos
                </Text>
              </TouchableOpacity>
            )}
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
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && { fontWeight: "bold", color: "#E31837" },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* DESTAQUES FILTRADOS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleText}>
              {selectedCategory
                ? `Destaques em ${selectedCategory}`
                : "Produtos em Destaque"}
            </Text>
          </View>
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
                Nenhum produto encontrado nesta categoria.
              </Text>
            }
          />

          {/* OFERTAS */}
          {randomOffers.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitleText}>Outras Ofertas</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.offersContainer}
              >
                {randomOffers.map((offer) => (
                  <View key={offer.id} style={styles.offerCard}>
                    {offer.image_url ? (
                      <Image
                        source={{ uri: offer.image_url }}
                        style={styles.offerImagePlaceholder}
                      />
                    ) : (
                      <View style={styles.offerImagePlaceholder} />
                    )}
                    <Text style={styles.offerName} numberOfLines={1}>
                      {offer.name}
                    </Text>
                    <Text style={styles.promoPriceText}>
                      {formatPrice(offer.price)}
                    </Text>

                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        backgroundColor: "#F0F0F0",
                        padding: 4,
                        borderRadius: 4,
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
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}
