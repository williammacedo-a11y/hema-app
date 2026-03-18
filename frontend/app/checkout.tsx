import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { styles } from "../styles/checkout.styles";
import { useCart } from "@/context/CartContext";

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "pix" | "card" | "cash";

const DELIVERY_FEE = 12.5;

export default function CheckoutScreen() {
  const router = useRouter();

  // 1. Pegando os dados REAIS do seu Context
  const { items, loading, cart } = useCart();

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");

  // 2. Cálculo do Subtotal baseado no seu Context
  // Se o seu backend já retornar o total no objeto 'cart', você pode usar cart.total
  const subtotal = useMemo(() => {
    return (items || []).reduce((acc, item) => {
      // Ajuste aqui conforme os nomes das propriedades no seu banco (ex: item.price * item.quantity)
      const price = item.price || 0;
      const quantity = item.quantity || item.weight || 0;
      return acc + price * quantity;
    }, 0);
  }, [items]);

  const currentDeliveryFee = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + currentDeliveryFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleConfirmOrder = () => {
    if (items.length === 0) {
      Alert.alert("Ops!", "Seu carrinho está vazio.");
      return;
    }

    if (deliveryMethod === "delivery" && (!street || !number)) {
      Alert.alert(
        "Atenção",
        "Por favor, preencha a rua e o número para a entrega.",
      );
      return;
    }

    Alert.alert(
      "Pedido Confirmado!",
      `Seu pedido no valor de ${formatPrice(total)} foi recebido com sucesso.`,
      [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }],
    );
  };

  // 3. Tela de carregamento
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

          {deliveryMethod === "delivery" && (
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Nome da Rua / Avenida"
                placeholderTextColor="#999"
                value={street}
                onChangeText={setStreet}
              />
              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, styles.inputHalfLeft]}
                  placeholder="Número"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                  value={number}
                  onChangeText={setNumber}
                />
                <TextInput
                  style={[styles.input, styles.inputHalfRight]}
                  placeholder="Complemento"
                  placeholderTextColor="#999"
                  value={complement}
                  onChangeText={setComplement}
                />
              </View>
            </View>
          )}
        </View>

        {/* 2. FORMA DE PAGAMENTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          <View style={styles.optionsRow}>
            {/* ... Seus botões de pagamento atuais estão corretos ... */}
          </View>
        </View>

        {/* 3. RESUMO DOS VALORES - Agora usando dados dinâmicos */}
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
          style={styles.confirmButton}
          activeOpacity={0.8}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => router.back()}
        >
          <Text style={styles.continueShoppingText}>
            Voltar e revisar carrinho
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
