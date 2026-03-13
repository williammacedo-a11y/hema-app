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
  ActivityIndicator,
} from "react-native";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import { getProductById, getSimilarProducts } from "@/services/products";
import { styles } from "../../styles/product.styles";
import { formatProductPrice } from "@/util/formatProductPrice";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);

      const [productData, similarData] = await Promise.all([
        getProductById(id),
        getSimilarProducts(id),
      ]);

      if (productData) {
        setProduct(productData);
      }
      setSimilarProducts(similarData);
      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#E31837" />
      </View>
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
          <Text style={{ color: "#E31837" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = async () => {
    await addItem({
      nome: product.name,
      tipo: "UNITARIO",
      total: product.price,
      qtd_desc: "1 un",
      qtd_numerica: 1,
      image_url: product.image_url,
    });

    console.log(typeof product.price, product.price);
    router.push("/cart");
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
