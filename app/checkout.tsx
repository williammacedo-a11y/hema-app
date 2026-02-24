import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { styles } from "../styles/checkout.styles";
import { useCart } from "@/context/CartContext";

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "pix" | "card" | "cash";

const DELIVERY_FEE = 12.5; // Taxa de entrega fixa para simulação

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems } = useCart();

  // Estados do formulário
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");

  // Estados de endereço (simples)
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");

  // Cálculos Financeiros
  const subtotal = useMemo(() => {
    return (cartItems || []).reduce(
      (acc, item) => acc + item.total * item.qtd_numerica,
      0,
    );
  }, [cartItems]);

  const currentDeliveryFee = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + currentDeliveryFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleConfirmOrder = () => {
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
      [{ text: "OK", onPress: () => router.push("/") }], // Volta para a Home
    );
  };

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
                style={styles.optionIcon}
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
                style={styles.optionIcon}
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

          {/* FORMULÁRIO DE ENDEREÇO (Aparece só se for Delivery) */}
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
            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentMethod === "pix" && styles.optionCardActive,
              ]}
              onPress={() => setPaymentMethod("pix")}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color={paymentMethod === "pix" ? "#E31837" : "#999"}
                style={styles.optionIcon}
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
              <Ionicons
                name="card-outline"
                size={24}
                color={paymentMethod === "card" ? "#E31837" : "#999"}
                style={styles.optionIcon}
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
              <Ionicons
                name="cash-outline"
                size={24}
                color={paymentMethod === "cash" ? "#E31837" : "#999"}
                style={styles.optionIcon}
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
              Subtotal ({cartItems?.length || 0} itens)
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

      {/* RODAPÉ FIXO PARA AÇÃO */}
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
