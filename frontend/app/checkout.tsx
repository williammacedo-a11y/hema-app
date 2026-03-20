import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

import { styles } from "../styles/checkout.styles";
import { useCart } from "@/context/CartContext";
import { getAddresses, Address } from "@/services/addresses";
import { OrdersService } from "@/services/orders";

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "pix" | "card" | "cash";

const DELIVERY_FEE = 12.5;

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, loading, cart } = useCart();

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Novos estados para o fluxo de pedido
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadAddresses = async () => {
        setLoadingAddresses((prev) => addresses.length === 0);

        try {
          const data = await getAddresses();

          if (isActive) {
            setAddresses(data);

            setSelectedAddressId((currentSelectedId) => {
              if (currentSelectedId) return currentSelectedId;

              if (data.length > 0) {
                const defaultAddr = data.find((a) => a.is_default);
                return defaultAddr ? defaultAddr.id : data[0].id;
              }
              return null;
            });
          }
        } catch (error) {
          console.error("Erro ao buscar endereços:", error);
          if (isActive) {
            Alert.alert("Erro", "Não foi possível carregar seus endereços.");
          }
        } finally {
          if (isActive) {
            setLoadingAddresses(false);
          }
        }
      };

      loadAddresses();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // 🐛 CÁLCULO CORRIGIDO: Agora trata o peso em gramas convertendo para KG
  const subtotal = cart?.total_price ? Number(cart.total_price) : 0;

  const currentDeliveryFee = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + currentDeliveryFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // 🚀 INTEGRAÇÃO COM O BACKEND
  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      Alert.alert("Ops!", "Seu carrinho está vazio.");
      return;
    }

    if (deliveryMethod === "delivery" && !selectedAddressId) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione ou adicione um endereço para a entrega.",
      );
      return;
    }

    try {
      setIsCreatingOrder(true);

      // Passa o ID se for delivery, ou NULL se for retirada na loja
      const addressToLog =
        deliveryMethod === "delivery" ? selectedAddressId : null;

      // Chama o backend
      await OrdersService.createOrder(addressToLog);

      // Dispara a animação/modal de sucesso
      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert(
        "Erro ao finalizar pedido",
        error.message || "Tente novamente mais tarde.",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#E31837" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Carregando dados do pedido...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. MÉTODO DE ENTREGA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como deseja receber?</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                deliveryMethod === "delivery" && styles.optionCardActive,
              ]}
              onPress={() => setDeliveryMethod("delivery")}
            >
              <MaterialCommunityIcons
                name="bike"
                size={28}
                color={deliveryMethod === "delivery" ? "#E31837" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  deliveryMethod === "delivery" && styles.optionTextActive,
                ]}
              >
                Delivery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                deliveryMethod === "pickup" && styles.optionCardActive,
              ]}
              onPress={() => setDeliveryMethod("pickup")}
            >
              <MaterialCommunityIcons
                name="storefront-outline"
                size={28}
                color={deliveryMethod === "pickup" ? "#E31837" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  deliveryMethod === "pickup" && styles.optionTextActive,
                ]}
              >
                Retirar na Loja
              </Text>
            </TouchableOpacity>
          </View>

          {/* DADOS DE ENTREGA / RETIRADA */}
          <View style={styles.deliveryDetailsContainer}>
            {deliveryMethod === "pickup" ? (
              <View style={styles.storeInfoBox}>
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={24}
                  color="#E31837"
                />
                <View style={styles.storeInfoTextContainer}>
                  <Text style={styles.storeInfoTitle}>
                    Endereço de Retirada
                  </Text>
                  <Text style={styles.storeInfoText}>
                    R. São José dos Pinhais, 187 - Sítio Cercado
                  </Text>
                  <Text style={styles.storeInfoText}>
                    Curitiba - PR, 81910-010
                  </Text>
                  <Text style={styles.storeInfoHours}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color="#666"
                    />{" "}
                    09hAM às 18h30PM (Fechado aos domingos)
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.addressHeader}>
                  <Text style={styles.subSectionTitle}>
                    Selecione o Endereço
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/addresses/new" as any)}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={24}
                      color="#E31837"
                    />
                  </TouchableOpacity>
                </View>

                {loadingAddresses ? (
                  <ActivityIndicator
                    size="small"
                    color="#E31837"
                    style={{ marginVertical: 20 }}
                  />
                ) : addresses.length === 0 ? (
                  <Text style={styles.emptyAddressText}>
                    Nenhum endereço cadastrado.
                  </Text>
                ) : (
                  addresses.map((address) => (
                    <TouchableOpacity
                      key={address.id}
                      style={[
                        styles.addressItem,
                        selectedAddressId === address.id &&
                          styles.addressItemActive,
                      ]}
                      onPress={() => setSelectedAddressId(address.id)}
                    >
                      {/* Ícone de seleção (Radio) */}
                      <MaterialCommunityIcons
                        name={
                          selectedAddressId === address.id
                            ? "radiobox-marked"
                            : "radiobox-blank"
                        }
                        size={20}
                        color={
                          selectedAddressId === address.id ? "#E31837" : "#999"
                        }
                      />

                      {/* Container principal dos textos */}
                      <View style={styles.addressItemTextContainer}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.addressItemStreet,
                              { flexShrink: 1 },
                            ]}
                            numberOfLines={1}
                          >
                            {address.street}, {address.number}
                          </Text>

                          {address.is_default && (
                            <View style={styles.defaultBadge}>
                              <MaterialCommunityIcons
                                name="star"
                                size={12}
                                color="#E31837"
                              />
                              <Text style={styles.defaultBadgeText}>
                                Favorito
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Detalhes do endereço ficam logo abaixo */}
                        <Text style={styles.addressItemDetails}>
                          {address.neighborhood} - {address.city}/
                          {address.state}
                          {address.complement ? ` • ${address.complement}` : ""}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>
        </View>

        {/* 2. FORMA DE PAGAMENTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === "pix" && styles.optionCardActive,
              ]}
              onPress={() => setPaymentMethod("pix")}
            >
              <MaterialCommunityIcons
                name="qrcode"
                size={24}
                color={paymentMethod === "pix" ? "#E31837" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  paymentMethod === "pix" && styles.optionTextActive,
                ]}
              >
                PIX
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === "card" && styles.optionCardActive,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={24}
                color={paymentMethod === "card" ? "#E31837" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  paymentMethod === "card" && styles.optionTextActive,
                ]}
              >
                Cartão
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === "cash" && styles.optionCardActive,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <MaterialCommunityIcons
                name="cash"
                size={24}
                color={paymentMethod === "cash" ? "#E31837" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  paymentMethod === "cash" && styles.optionTextActive,
                ]}
              >
                Dinheiro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. RESUMO DOS VALORES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo da Compra</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({items?.length || 0} itens)
            </Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de Entrega</Text>
            <Text style={styles.summaryValue}>
              {deliveryMethod === "pickup"
                ? "Grátis"
                : formatPrice(DELIVERY_FEE)}
            </Text>
          </View>

          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, isCreatingOrder && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={handleConfirmOrder}
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => router.back()}
          disabled={isCreatingOrder}
        >
          <Text style={styles.continueShoppingText}>
            Voltar e revisar carrinho
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 16,
              padding: 30,
              alignItems: "center",
              width: "100%",
              maxWidth: 340,
              elevation: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 10,
            }}
          >
            <MaterialCommunityIcons
              name="check-decagram"
              size={80}
              color="#4CAF50"
            />

            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1A1A1A",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Pedido Confirmado!
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
                marginTop: 8,
                marginBottom: 24,
                lineHeight: 22,
              }}
            >
              Recebemos seu pedido e já vamos começar a preparar.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#E31837",
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 8,
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(tabs)/home");
              }}
            >
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>
                Concluir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
