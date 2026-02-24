import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from 'expo-router';
import { styles } from "../../styles/cart.styles";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/services/cart";

export default function CartScreen() {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const router = useRouter();

  const subtotal = useMemo(() => {
    return (cartItems || []).reduce(
      (acc, item) => acc + item.total * item.qtd_numerica,
      0,
    );
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.imagePlaceholder}
        />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Ionicons name="image-outline" size={24} color="#CCC" />
        </View>
      )}

      <View style={styles.itemDetails}>
        <View>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.nome}
          </Text>
          {/* Mostrando o preço unitário e o tipo (ex: 1 un) */}
          <Text style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
            {item.qtd_desc}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(item.total)}</Text>
        </View>

        <View style={styles.itemFooter}>
          {/* Controle de Quantidade */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.nome, "decrease")}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.qtd_numerica}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item.nome, "increase")}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Remover */}
          <TouchableOpacity
            onPress={() => removeItem(item.nome)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Carrinho</Text>
        </View>

        {/* Lista de Produtos Reais do Banco */}
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.nome} // Chave única baseada no nome
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyCartText}>Seu carrinho está vazio.</Text>
          }
        />

        {/* Resumo e Botão Finalizar */}
        {cartItems.length > 0 && (
          <View style={styles.footerContainer}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>{formatPrice(subtotal)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8} onPress={() => router.push('/checkout')}>
              <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
