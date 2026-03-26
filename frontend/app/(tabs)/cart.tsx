import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Animated,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "@/util/toast";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";

import { styles } from "../../styles/cart.styles";
import { useCart } from "@/context/CartContext";
import { CartItemSkeleton } from "@/components/CartItemSkeleton";
import { PriceSkeleton } from "@/components/PriceSkeleton";

// --- CART ITEM COMPONENT ---
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

  const renderRightActions = (progress: any, dragX: any) => {
    const opacity = dragX.interpolate({
      inputRange: [-60, -10],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.swipeDeleteAction}>
        <Animated.View
          style={{
            opacity,
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 24,
            height: "100%",
          }}
        >
          <Ionicons name="trash" size={26} color="#FFF" />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={1.5}
        rightThreshold={80}
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            removeItem(item.id);
          }
        }}
      >
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

// --- CART SCREEN ---
export default function CartScreen() {
  const { removeItem, updateItem, refreshCart, items, cart, loading } =
    useCart();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshCart();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshCart();
    setRefreshing(false);
  };

  const handleRemoveItem = async (id: string) => {
    setIsCalculating(true);
    await removeItem(id);
    setIsCalculating(false);
  };

  const handleUpdateItem = async (id: string, data: any) => {
    setIsCalculating(true);
    await updateItem(id, data);
    setIsCalculating(false);
  };

  function validateWeight(weight: number) {
    if (weight < 50) {
      Toast.show({ type: "error", text1: "O peso mínimo é de 50g" });
      return false;
    }
    return true;
  }

  const showListSkeleton = (loading && items.length === 0) || refreshing;
  const showPriceSkeleton = loading || refreshing || isCalculating;

  const renderCartItem = ({ item }: any) => {
    if (showListSkeleton) {
      return <CartItemSkeleton />;
    }
    return (
      <CartItemComponent
        item={item}
        updateItem={handleUpdateItem}
        removeItem={handleRemoveItem}
        validateWeight={validateWeight}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Meu Carrinho</Text>
          </View>

          <FlatList
            data={showListSkeleton ? [1, 2, 3] : items}
            renderItem={renderCartItem}
            keyExtractor={(item, index) =>
              showListSkeleton ? `skel-${index}` : item.id
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={showListSkeleton ? ["transparent"] : ["#E31837"]}
                tintColor={showListSkeleton ? "transparent" : "#E31837"}
              />
            }
            ListEmptyComponent={
              showListSkeleton ? null : (
                <View style={{ alignItems: "center", marginTop: 60 }}>
                  <Ionicons name="cart-outline" size={64} color="#DDD" />
                  <Text style={[styles.emptyCartText, { marginTop: 10 }]}>
                    Seu carrinho está vazio.
                  </Text>
                </View>
              )
            }
          />

          {/* Resumo e Botão Finalizar */}
          {items.length > 0 && !showListSkeleton && (
            <View style={styles.footerContainer}>
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>

                {showPriceSkeleton ? (
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
                style={[
                  styles.checkoutButton,
                  showPriceSkeleton && { opacity: 0.7 },
                ]}
                activeOpacity={0.8}
                onPress={() => router.push("/checkout")}
                disabled={showPriceSkeleton}
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
