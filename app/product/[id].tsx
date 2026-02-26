import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
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
import { styles } from "../../styles/product.styles";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      const { data, error } = await supabase
        .from("produtos_hema_cereais")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProduct({
          id: data.id,
          name: data.nome,
          price: data.preço,
          quantity: Number(data.quantidade),
          description: data.descricao ?? "",
          image_url: data.url_imagem ?? "",
          createdAt: data.created_at,
        });
      }

      const { data: doc } = await supabase
        .from("documents")
        .select("embedding")
        .eq("id_produto", id)
        .single();

      if (doc?.embedding) {
        const { data: similarDocs } = await supabase.rpc(
          "match_similar_products",
          {
            query_embedding: doc.embedding,
            current_id: id,
            match_count: 10,
          },
        );

        if (similarDocs?.length) {
          const ids = similarDocs.map((d: any) => d.id_produto);

          const { data: products } = await supabase
            .from("produtos_hema_cereais")
            .select("*")
            .in("id", ids);

          if (products) {
            setSimilarProducts(
              products.map((p: any) => ({
                id: p.id,
                name: p.nome,
                price: p.preço,
                quantity: Number(p.quantidade),
                description: p.descricao ?? "",
                image_url: p.url_imagem ?? "",
                createdAt: p.created_at,
              })),
            );
          }
        }
      }

      setLoading(false);
    }

    loadProduct();
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

        {similarProducts.length > 0 && (
          <View style={{ marginTop: 20 }}>
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
                    {formatPrice(item.price)}
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
