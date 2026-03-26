import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Alert, // Mantive apenas para o aviso de área não atendida (pois precisa do botão de confirmar)
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

import { styles } from "../styles/checkout.styles";
import { useCart } from "@/context/CartContext";
import { getAddresses, Address } from "@/services/addresses";
import { OrdersService } from "@/services/orders";
import { Toast } from "@/util/toast"; // Novo import de Toasts

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "pix" | "credit_card" | "cash";

function calculateDeliveryFee(city?: string): number {
  if (!city) return 0;

  const normalizedCity = city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const tier10 = [
    "curitiba",
    "araucaria",
    "balsa nova",
    "pinhais",
    "sao jose dos pinhais",
  ];
  const tier15 = ["colombo", "almirante tamandare", "piraquara"];

  if (tier10.includes(normalizedCity)) return 10.0;
  if (tier15.includes(normalizedCity)) return 15.0;

  return -1;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, loading, cart, refreshCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    // 1. Atualiza o carrinho (silencioso)
    await refreshCart();

    // 2. Busca os endereços (Motor lida com erros de rede)
    const response = await getAddresses();

    if (response.success && response.data) {
      const data = response.data;
      setAddresses(data);

      // 3. Seleção automática
      setSelectedAddressId((currentSelectedId) => {
        if (currentSelectedId) return currentSelectedId;
        if (data.length > 0) {
          const defaultAddr = data.find((a) => a.is_default);
          return defaultAddr ? defaultAddr.id : data[0].id;
        }
        return null;
      });
    } else {
      console.log("Falha ao carregar endereços no checkout:", response.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoadingAddresses(addresses.length === 0);
      loadData().finally(() => setLoadingAddresses(false));
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const subtotal = cart?.total_price ? Number(cart.total_price) : 0;
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const currentDeliveryFee = useMemo(() => {
    if (deliveryMethod === "pickup") return 0;
    return calculateDeliveryFee(selectedAddress?.city);
  }, [deliveryMethod, selectedAddress]);

  const displayDeliveryFee = currentDeliveryFee === -1 ? 0 : currentDeliveryFee;
  const total = subtotal + displayDeliveryFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    if (
      deliveryMethod === "delivery" &&
      currentDeliveryFee === -1 &&
      selectedAddressId
    ) {
      // Mantivemos o Alert nativo aqui pois essa é uma mensagem bloqueante que o usuário precisa confirmar "Entendi"
      const timer = setTimeout(() => {
        Alert.alert(
          "Região não atendida 🛵",
          "Infelizmente ainda não realizamos entregas flex para esta cidade.\n\nPor favor, selecione outro endereço ou mude para a opção 'Retirar na Loja'.",
          [{ text: "Entendi", style: "default" }],
        );
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentDeliveryFee, deliveryMethod, selectedAddressId]);

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      return Toast.show({ type: "error", text1: "Seu carrinho está vazio." });
    }

    if (deliveryMethod === "delivery") {
      if (!selectedAddressId) {
        return Toast.show({
          type: "error",
          text1: "Atenção",
          text2: "Por favor, selecione um endereço para a entrega.",
        });
      }

      if (currentDeliveryFee === -1) {
        return Toast.show({
          type: "error",
          text1: "Região não atendida",
          text2: "Selecione a opção Retirada na Loja.",
        });
      }
    }

    setIsCreatingOrder(true);

    const addressToLog =
      deliveryMethod === "delivery" ? selectedAddressId : null;

    const response = await OrdersService.createOrder({
      address_id: addressToLog,
      payment_method: paymentMethod,
    });

    setIsCreatingOrder(false);

    if (response.success && response.data) {
      // Limpa carrinho só depois que deu certo
      await refreshCart();

      if (paymentMethod === "cash") {
        setShowSuccessModal(true);
      } else {
        router.push({
          pathname: "/payment/[id]",
          params: {
            id: response.data.order_id,
            method: paymentMethod,
            total: response.data.total_price,
          },
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Erro ao finalizar pedido",
        text2: response.message,
      });
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E31837"]}
            tintColor="#E31837"
          />
        }
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
                      <View style={styles.addressItemTextContainer}>
                        {address.label && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              color: "#333",
                              marginBottom: 2,
                            }}
                          >
                            {address.label}
                          </Text>
                        )}

                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
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
                paymentMethod === "credit_card" && styles.optionCardActive, // credit_card!
              ]}
              onPress={() => setPaymentMethod("credit_card")} // credit_card!
            >
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={24}
                color={paymentMethod === "credit_card" ? "#E31837" : "#999"}
              />
              <Text
                style={[
                  styles.optionText,
                  paymentMethod === "credit_card" && styles.optionTextActive,
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
            <Text
              style={[
                styles.summaryValue,
                currentDeliveryFee === -1 && { color: "#E31837" },
              ]}
            >
              {deliveryMethod === "pickup"
                ? "Grátis"
                : currentDeliveryFee === -1
                  ? "Região não atendida"
                  : formatPrice(currentDeliveryFee)}
            </Text>
          </View>

          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 4. FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (isCreatingOrder || currentDeliveryFee === -1) && { opacity: 0.7 },
          ]}
          activeOpacity={0.8}
          onPress={handleConfirmOrder}
          disabled={isCreatingOrder || currentDeliveryFee === -1}
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
                refreshCart();
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
