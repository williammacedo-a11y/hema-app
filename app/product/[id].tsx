import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles/product.styles";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { addToCart } = useCart();

  // Pega os parâmetros passados na rota
  const { data } = useLocalSearchParams<{ data: string }>();

  // Como passamos via string, precisamos transformar de volta em Objeto
  const product: Product | null = data ? JSON.parse(data) : null;

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

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleAddToCart = async () => {
    await addToCart({
      nome: product.name,
      tipo: "UNITARIO",
      total: product.price,
      qtd_desc: "1 un",
      qtd_numerica: 1,
      image_url: product.image_url,
    });
    // Vai direto para o carrinho após adicionar
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
              source={{ uri: product.image_url }}
              style={styles.productImage}
            />
          ) : (
            <>
              <Ionicons name="image-outline" size={60} color="#DDD" />
              <Text style={styles.noImageText}>Sem foto</Text>
            </>
          )}
        </View>

        {/* DETALHES */}
        <View style={styles.detailsContainer}>
          <Text style={styles.categoryText}>Produto</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              {formatPrice(product.price)}
            </Text>
            <Text style={styles.unitText}>/ unidade</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>
            {product.description ||
              "Nenhuma descrição disponível para este produto."}
          </Text>
        </View>
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
