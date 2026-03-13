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
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { styles } from "../../styles/cart.styles";
import { useCart } from "@/context/CartContext";
import { CartItemWithProduct } from "@/types/cart";

export default function CartScreen() {
  const { removeItem, addItem, items, cart } = useCart();
  const router = useRouter();

  const subtotal = useMemo(() => {
    return (items || []).reduce(
      (acc, item) => acc + item.total * item.qtd_numerica,
      0,
    );
  }, [items]);

  const formatPrice = (price?: number) =>
    (price ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const renderCartItem = ({ item }: { item: CartItemWithProduct }) => (
    <View style={styles.cartItem}>
      {item.product.image_url ? (
        <Image
          source={{ uri: item.product.image_url }}
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
            {item.product.name}
          </Text>
          {/* Mostrando o preço unitário e o tipo (ex: 1 un) */}
          <Text style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
            {item.product.qtd_desc}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>
        </View>

        <View style={styles.itemFooter}>
          {/* Controle de Quantidade */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.product.name, "decrease")}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.qtd_numerica}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item.product.name, "increase")}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Remover */}
          <TouchableOpacity
            onPress={() => removeItem(item.product.name)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={{ flex: 1 }}>
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
                <Text style={styles.subtotalValue}>
                  {formatPrice(subtotal)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                activeOpacity={0.8}
                onPress={() => router.push("/checkout")}
              >
                <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
