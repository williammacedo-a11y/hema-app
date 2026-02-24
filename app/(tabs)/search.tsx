import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 1. IMPORTANDO O ROUTER

import { styles } from "../../styles/search.styles";
import { getProducts } from "@/services/products";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext"; // 2. IMPORTANDO O CONTEXTO

// Buscas frequentes
const FREQUENT_SEARCHES = [
  "Aveia",
  "Whey",
  "Creatina",
  "Granola",
  "Sem Glúten",
  "Sementes",
  "Castanhas",
];

type SortType = "" | "A-Z" | "PRICE_ASC" | "PRICE_DESC";

export default function SearchScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortType>("");

  // 3. INICIANDO ROUTER E CARRINHO
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const normalizeText = (text?: string) => {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery);

    let result = products.filter((product) => {
      const normalizedName = normalizeText(product.name);
      const normalizedDesc = normalizeText(product.description);
      return normalizedName.includes(query) || normalizedDesc.includes(query);
    });

    if (sortOrder === "A-Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "PRICE_ASC") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "PRICE_DESC") {
      result.sort((a, b) => b.price - a.price);
    }

    if (!searchQuery) {
      result = result.slice(0, 10);
    }

    return result;
  }, [products, searchQuery, sortOrder]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleFrequentSearch = (term: string) => {
    setSearchQuery(term);
  };

  // 4. FUNÇÃO DE ADICIONAR E NAVEGAR
  const handleAddAndNavigate = async (product: Product) => {
    // Transforma o Produto no formato esperado pelo CartItem do banco
    await addToCart({
      nome: product.name,
      tipo: "UNITARIO", // Tipo padrão
      total: product.price,
      qtd_desc: "1 un", // Descrição padrão
      qtd_numerica: 1, // Começa sempre com 1
      image_url: product.image_url,
    });

    // Redireciona para a aba do carrinho
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
          style={styles.imagePlaceholder}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={32} color="#DDD" />
          <Text style={styles.placeholderText}>Sem foto</Text>
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>

        {/* 5. VINCULANDO A FUNÇÃO AO BOTÃO */}
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

      <View style={styles.container}>
        {/* BARRA DE BUSCA E BOTÃO DE FILTRO */}
        <View style={styles.searchHeader}>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Ex: Granola com mel..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.filterButtonText}>ORDENAR</Text>
          </TouchableOpacity>
        </View>

        {/* BUSCAS FREQUENTES */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.frequentScroll}
          >
            {FREQUENT_SEARCHES.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.badge}
                onPress={() => handleFrequentSearch(term)}
              >
                <Text style={styles.badgeText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* LISTA DE RESULTADOS */}
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#E31837" />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {searchQuery
                  ? `Nenhum resultado para "${searchQuery}".`
                  : "Nenhum produto cadastrado."}
              </Text>
            }
            ListFooterComponent={
              !searchQuery && filteredProducts.length === 10 ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#888",
                    padding: 10,
                    fontSize: 12,
                  }}
                >
                  Mostrando os 10 primeiros. Use a busca para ver mais.
                </Text>
              ) : null
            }
          />
        )}
      </View>

      {/* POPOVER DE ORDENAÇÃO */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ordenar por</Text>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortOrder === "A-Z" && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortOrder("A-Z");
                setModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOrder === "A-Z" && styles.sortOptionTextActive,
                ]}
              >
                Ordem Alfabética (A-Z)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortOrder === "PRICE_ASC" && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortOrder("PRICE_ASC");
                setModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOrder === "PRICE_ASC" && styles.sortOptionTextActive,
                ]}
              >
                Menor Preço
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortOrder === "PRICE_DESC" && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortOrder("PRICE_DESC");
                setModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOrder === "PRICE_DESC" && styles.sortOptionTextActive,
                ]}
              >
                Maior Preço
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Fechar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
