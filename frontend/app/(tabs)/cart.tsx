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
import { SuccessToast, ErrorToast } from "@/components/CustomToast";
import { styles } from "../../styles/cart.styles";
import { useCart } from "@/context/CartContext";
import { CartItemWithProduct } from "@/types/cart";

export default function CartScreen() {
  const { removeItem, updateItem, items, cart } = useCart();
  const router = useRouter();

  const subtotal = useMemo(() => {
    return (items || []).reduce((acc, item) => {
      if (item.quantity) {
        return acc + item.price * item.quantity;
      }

      if (item.weight) {
        return acc + item.price;
      }

      return acc;
    }, 0);
  }, [items]);

  const formatPrice = (price?: number) =>
    (price ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  function validateWeight(weight: number) {
    if (weight < 50) {
      ErrorToast({ text1: "Peso mínimo é de 50g" });
      return false;
    }

    return true;
  }

  function updateQuantity(
    item: CartItemWithProduct,
    action: "increase" | "decrease",
  ) {
    if (item.product.type === "unit") {
      const newQuantity =
        action === "increase"
          ? item.quantity || 0 + 1
          : Math.max(1, item.quantity || 0 - 1);

      updateItem(item.id, { quantity: newQuantity });
    } else {
      const newWeight =
        action === "increase"
          ? item.weight || 0 + 50
          : Math.max(50, item.weight || 0 - 50);

      if (!validateWeight(newWeight)) return;

      updateItem(item.id, { weight: newWeight });
    }
  }

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
            {item.product.price}
          </Text>
          <Text style={styles.qtyText}>
            {item.product.type === "unit"
              ? formatPrice(item.product.price || 0)
              : formatPrice(item.price)}
          </Text>
        </View>

        <View style={styles.itemFooter}>
          {/* Controle de Quantidade */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => updateQuantity(item, "decrease")}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item, "increase")}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Remover */}
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
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
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id} // Chave única baseada no id
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyCartText}>Seu carrinho está vazio.</Text>
            }
          />

          {/* Resumo e Botão Finalizar */}
          {items.length > 0 && (
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
