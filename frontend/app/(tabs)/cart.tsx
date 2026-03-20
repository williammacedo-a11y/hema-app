import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "@/util/toast";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";

import { styles } from "../../styles/cart.styles";
import { useCart } from "@/context/CartContext";
import { CartItemWithProduct } from "@/types/cart";
import { PriceSkeleton } from "@/components/PriceSkeleton";

// Pegamos a largura da tela para saber o que é "arrastar até a metade"
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CartItemComponent = ({
  item,
  updateItem,
  removeItem,
  validateWeight,
}: any) => {
  const inputRef = useRef<TextInput>(null);
  const swipeableRef = useRef<Swipeable>(null);

  const basePrice =
    item.product.type === "unit"
      ? item.product.price || 0
      : item.product.price_per_kg || 0;
  const itemTotalPrice =
    item.product.type === "unit"
      ? parseFloat(basePrice.toString()) * (item.quantity || 0)
      : (parseFloat(basePrice.toString()) * (item.weight || 0)) / 1000;

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formattedUnitPrice = currencyFormatter.format(
    parseFloat(basePrice.toString()),
  );
  const formattedItemTotal = currencyFormatter.format(itemTotalPrice);

  // === UI DO FUNDO VERMELHO (REVELADA AO ARRASTAR) ===
  const renderRightActions = (progress: any, dragX: any) => {
    // Opacidade aumenta conforme arrasta
    const opacity = dragX.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, -50, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: "clamp",
    });

    const scale = dragX.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, -50, 0],
      outputRange: [1.2, 0.8, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.swipeDeleteAction}>
        <Animated.View
          style={{
            opacity,
            transform: [{ scale }],
            alignItems: "center",
            paddingRight: 30,
          }}
        >
          <Ionicons name="trash" size={32} color="#FFF" />
          <Text style={styles.swipeDeleteText}>Solte para excluir</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    // Colocamos o Swipeable solto e a margem inferior (se houver) fora dele
    <View style={{ marginBottom: 15 }}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        // Exige arrastar +- 40% da tela para ativar a deleção
        rightThreshold={SCREEN_WIDTH * 0.4}
        // Quando passar do limite e abrir, deleta na hora!
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            removeItem(item.id);
          }
        }}
      >
        {/* Usamos marginBottom: 0 aqui para o vermelho não vazar para a margem */}
        <View style={[styles.cartItem, { marginBottom: 0 }]}>
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
              <Text style={styles.itemTotalPrice}>{formattedItemTotal}</Text>
            </View>

            <View style={styles.itemFooter}>
              <View style={styles.qtyLabelContainer}>
                {item.product.type === "unit" ? (
                  // BOTOES DE UNIDADE
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        updateItem(item.id, {
                          quantity: Math.max(1, (item.quantity || 0) - 1),
                        })
                      }
                      style={styles.qtyButton}
                    >
                      <Ionicons name="remove" size={16} color="#E31837" />
                    </TouchableOpacity>

                    <View style={{ minWidth: 30, alignItems: "center" }}>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        updateItem(item.id, {
                          quantity: (item.quantity || 0) + 1,
                        })
                      }
                      style={styles.qtyButton}
                    >
                      <Ionicons name="add" size={16} color="#E31837" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  // INPUT DE PESO
                  <View style={styles.weightEditContainer}>
                    <TextInput
                      ref={inputRef}
                      style={styles.weightInput}
                      keyboardType="numeric"
                      defaultValue={String(item.weight)}
                      maxLength={4}
                      onEndEditing={(e) => {
                        const value = parseInt(e.nativeEvent.text) || 0;
                        if (value < 50) {
                          validateWeight(0);
                          updateItem(item.id, { weight: 50 });
                          if (inputRef.current)
                            inputRef.current.setNativeProps({ text: "50" });
                        } else {
                          updateItem(item.id, { weight: value });
                        }
                      }}
                    />
                    <Text style={styles.weightUnitText}>g</Text>

                    <TouchableOpacity
                      style={styles.editWeightButton}
                      onPress={() => inputRef.current?.focus()}
                    >
                      <Ionicons name="pencil" size={14} color="#E31837" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* BOTÃO REMOVER ORIGINAL RESTAURADO! */}
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
      </Swipeable>
    </View>
  );
};

export default function CartScreen() {
  const { removeItem, updateItem, refreshCart, items, cart, loading } =
    useCart();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refreshCart();
    }, []),
  );

  function validateWeight(weight: number) {
    if (weight < 50) {
      Toast.show({ type: "error", text1: "O peso mínimo é de 50g" });
      return false;
    }
    return true;
  }

  const renderCartItem = ({ item }: { item: CartItemWithProduct }) => {
    return (
      <CartItemComponent
        item={item}
        updateItem={updateItem}
        removeItem={removeItem}
        validateWeight={validateWeight}
      />
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

                {loading ? (
                  <PriceSkeleton />
                ) : (
                  <Text style={styles.subtotalValue}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(parseFloat(cart?.total_price || "0"))}
                  </Text>
                )}
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
