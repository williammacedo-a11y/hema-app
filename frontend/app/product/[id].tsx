import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import { getProductById, getSimilarProducts } from "@/services/products";
import { styles } from "../../styles/product.styles";
import { formatProductPrice } from "@/util/formatProductPrice";
import { Toast } from "@/util/toast";
import { ProductDetailsSkeleton } from "@/components/ProductDetailSkeleton";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData() {
    if (!id) return;

    const [productRes, similarRes] = await Promise.all([
      getProductById(id as string),
      getSimilarProducts(id as string),
    ]);

    if (productRes.success && productRes.data) {
      setProduct(productRes.data);
    } else {
      Toast.show({ type: "error", text1: "Oops!", text2: productRes.message });
    }

    if (similarRes.success && similarRes.data) {
      setSimilarProducts(similarRes.data);
    }
  }

  useEffect(() => {
    async function initialLoad() {
      setLoading(true);
      await fetchData();
      setLoading(false);
    }
    initialLoad();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <>
        <TouchableOpacity
          style={[styles.header, { backgroundColor: "#FFF" }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <ProductDetailsSkeleton />
      </>
    );
  }

  if (!product) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Produto não encontrado.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#E31837", fontWeight: "bold" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = async () => {
    if (!product) return;

    const payload = {
      product_id: product.id,
      price: product.type === "unit" ? product.price : product.price_per_kg,
      ...(product.type === "unit" ? { quantity: 1 } : { weight: 50 }),
    };

    await addItem(payload);
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Botão de Voltar Flutuante sobre a Imagem */}
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E31837"]}
            tintColor="#E31837"
          />
        }
      >
        {/* IMAGEM DO PRODUTO */}
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url.trim() }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={60} color="#DDD" />
          )}
        </View>

        {/* DETALHES */}
        <View style={styles.detailsContainer}>
          <Text style={styles.categoryText}>Produto</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              {formatProductPrice(product)}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Descrição</Text>

          <Text
            style={styles.descriptionText}
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {product.description ||
              "Nenhuma descrição disponível para este produto."}
          </Text>

          {product.description && (
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
              style={styles.readMoreButton}
            >
              <Text style={styles.readMoreText}>
                {showFullDescription ? "Ler menos" : "Ler mais..."}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {similarProducts.length > 0 && (
          <View style={{ margin: 20 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
            >
              Produtos similares
            </Text>

            {similarProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/product/${item.id}`)}
                style={{ flexDirection: "row", marginBottom: 12 }}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text numberOfLines={2}>{item.name}</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {formatProductPrice(item)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* RODAPÉ FIXO */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>ADICIONAR AO CARRINHO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
