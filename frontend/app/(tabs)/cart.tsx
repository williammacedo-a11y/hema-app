import React, { useMemo, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

export default function CartScreen() {
  const { removeItem, updateItem, refreshCart, items, cart } = useCart();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refreshCart();
    }, []),
  );

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = parseFloat(item.product.price) || 0;
      if (item.product.type === "unit") {
        return acc + price * (item.quantity || 0);
      } else {
        return acc + (price * (item.weight || 0)) / 1000;
      }
    }, 0);
  }, [items]);

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
      const currentQty = item.quantity || 0;
      const newQuantity =
        action === "increase" ? currentQty + 1 : Math.max(1, currentQty - 1);

      updateItem(item.id, { quantity: newQuantity });
    } else {
      const currentWeight = item.weight || 0;
      const newWeight =
        action === "increase"
          ? currentWeight + 50
          : Math.max(50, currentWeight - 50);

      if (!validateWeight(newWeight)) return;

      updateItem(item.id, { weight: newWeight });
    }
  }

  const renderCartItem = ({ item }: { item: CartItemWithProduct }) => {
    // Cálculo do preço total deste item (Preço * Qtd ou Preço * Peso/1000)
    const basePrice =
      item.product.type === "unit"
        ? item.product.price || 0
        : item.product.price_per_kg || 0;

    // 2. Cálculo do Total do Item
    const itemTotalPrice =
      item.product.type === "unit"
        ? parseFloat(basePrice.toString()) * (item.quantity || 0)
        : (parseFloat(basePrice.toString()) * (item.weight || 0)) / 1000;

    // 3. Formatação para Moeda (BRL)
    const currencyFormatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const formattedUnitPrice = currencyFormatter.format(
      parseFloat(basePrice.toString()),
    );
    const formattedItemTotal = currencyFormatter.format(itemTotalPrice);

    return (
      <View style={styles.cartItem}>
        {/* Imagem Menor e Proporcional */}
        <View style={styles.imageContainer}>
          {item.product.image_url ? (
            <Image
              source={{ uri: item.product.image_url }}
              style={styles.image}
            />
          ) : (
            <Ionicons name="image-outline" size={20} color="#CCC" />
          )}
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.unitPriceText}>
                {formattedUnitPrice}{" "}
                {item.product.type === "unit" ? "/un" : "/kg"}
              </Text>
            </View>

            {/* Valor Total do Item à Direita */}
            <Text style={styles.itemTotalPrice}>{formattedItemTotal}</Text>
          </View>

          <View style={styles.itemFooter}>
            {/* Controle de Quantidade Dinâmico */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => updateQuantity(item, "decrease")}
                style={styles.qtyButton}
              >
                <Ionicons name="remove" size={16} color="#E31837" />
              </TouchableOpacity>

              <View style={styles.qtyLabelContainer}>
                <Text style={styles.qtyText}>
                  {item.product.type === "unit"
                    ? item.quantity
                    : `${item.weight}g`}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => updateQuantity(item, "increase")}
                style={styles.qtyButton}
              >
                <Ionicons name="add" size={16} color="#E31837" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={16} color="#999" />
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Meu Carrinho</Text>
          </View>

          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
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
                  R$ {subtotal.toFixed(2).replace(".", ",") ?? "0,00"}
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
