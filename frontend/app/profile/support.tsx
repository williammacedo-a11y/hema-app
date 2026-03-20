import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SupportScreen() {
  const router = useRouter();

  const handleWhatsApp = () => {
    // Altere para o número real do seu atendimento
    const phoneNumber = "5541900000000";
    const message = "Olá! Preciso de ajuda com o meu pedido no app HEMA.";
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backBtn: { padding: 8 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  content: { flex: 1, padding: 20 },
  aiBox: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  aiTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 12 },
  aiText: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  aiButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  aiButtonText: { color: "#999", fontWeight: "bold" },
  dividerText: {
    textAlign: "center",
    color: "#999",
    fontWeight: "bold",
    fontSize: 12,
    marginVertical: 30,
  },
  wppButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#25D366",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  wppTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  wppSubtitle: { color: "#E0F7E9", fontSize: 12, marginTop: 4 },
});
