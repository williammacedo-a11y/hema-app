import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "@/styles/profile.styles";

export default function SupportScreen() {
  const router = useRouter();

  const handleWhatsApp = () => {
    // Altere para o número real do seu atendimento
    const phoneNumber = "554197935825";
    const message = "Olá! Preciso de ajuda com o meu pedido no app da HEMA.";
    Linking.openURL(
      `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`,
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajuda e Suporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Placeholder do Agente de IA */}
        <View style={styles.aiBox}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={48}
            color="#E31837"
          />
          <Text style={styles.aiTitle}>Assistente Virtual HEMA</Text>
          <Text style={styles.aiText}>
            Nosso agente inteligente está sendo treinado e logo estará
            disponível para tirar suas dúvidas 24 horas por dia!
          </Text>
          <TouchableOpacity style={styles.aiButton} disabled>
            <Text style={styles.aiButtonText}>
              Chat indisponível no momento
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dividerText}>OU FALE COM UM HUMANO</Text>

        <TouchableOpacity style={styles.wppButton} onPress={handleWhatsApp}>
          <MaterialCommunityIcons name="whatsapp" size={28} color="#FFF" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.wppTitle}>Atendimento via WhatsApp</Text>
            <Text style={styles.wppSubtitle}>Seg à Sáb das 09h às 18h</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
