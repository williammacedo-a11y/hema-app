import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { styles } from "@/styles/payment.styles";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Toast } from "@/util/toast"; // Substituindo os Alerts pelo Toast

const formatPrice = (value: string | number) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val || 0);
};

export default function PaymentPage() {
  const { id, method, total } = useLocalSearchParams<{
    id: string;
    method: string;
    total: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const displayId = id ? id.split("-")[0] : "...";

  useEffect(() => {
    // Isso aqui é um mock visual temporário.
    // No futuro, aqui você faria um fetch(getOrderDetails) para pegar o QR code real do PIX
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyPix = async () => {
    const fakePixCode =
      "00020101021226870014br.gov.bcb.pix25650021br.mercadopago.mock123456";
    await Clipboard.setStringAsync(fakePixCode);

    Toast.show({
      type: "success",
      text1: "Código copiado!",
      text2: "Agora é só colar no app do seu banco.",
    });
  };

  const handleFinishPayment = () => {
    if (method === "credit_card") {
      Toast.show({ type: "success", text1: "Pagamento enviado com sucesso!" });
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E31837" />
        <Text style={styles.loadingText}>Configurando check-out...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header Customizado com Botão Voltar */}
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <MaterialCommunityIcons
            name="chevron-left"
            color="#1A1A1A"
            size={32}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", marginLeft: 10 }}>
          Checkout
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo do Pedido */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel} numberOfLines={1}>
              PEDIDO #{displayId}
            </Text>
            <Text style={styles.companyName} numberOfLines={1}>
              Hema Cereais
            </Text>
          </View>

          <View style={styles.summaryValueContainer}>
            <Text style={styles.summaryTotal}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Alerta de Preparação */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="clock-fast" size={24} color="#E31837" />
          <Text style={styles.infoText}>
            Assim que o pagamento for aprovado nossos funcionários vão começar a
            preparar o pedido
          </Text>
        </View>

        {method === "pix" ? (
          <View style={styles.paymentMethodContainer}>
            <Text style={styles.sectionTitle}>Pague com PIX</Text>

            <View style={styles.qrCodeWrapper}>
              <View style={styles.qrCodePlaceholder}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={140}
                  color="#1A1A1A"
                />
              </View>
              <Text style={styles.qrInstructions}>
                Escaneie o QR Code acima
              </Text>
            </View>

            <View style={styles.copyPasteArea}>
              <Text style={styles.copyLabel}>Ou copie o código:</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyPix}
              >
                <Text style={styles.pixCodeText} numberOfLines={1}>
                  {id}-pix-mercadopago-mock-2026-delivery-app
                </Text>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={22}
                  color="#E31837"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.paymentMethodContainer}>
            <Text style={styles.sectionTitle}>Dados do Cartão</Text>

            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número do Cartão</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Validade</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View
                style={[styles.inputGroup, { marginTop: 20, marginBottom: 0 }]}
              >
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Como está no cartão"
                  autoCapitalize="characters"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        )}

        {/* Botão de Ação Final */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleFinishPayment}
        >
          <MaterialCommunityIcons
            name={method === "pix" ? "check-bold" : "credit-card-check"}
            size={24}
            color="#FFF"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.mainButtonText}>
            {method === "pix"
              ? "Já realizei o pagamento"
              : "Finalizar Pagamento"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
