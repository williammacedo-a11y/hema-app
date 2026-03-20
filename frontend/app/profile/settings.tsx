import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Atenção",
      "Deseja solicitar a exclusão da sua conta? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir Conta",
          style: "destructive",
          onPress: () => console.log("Conta deletada"),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowText}>Atualizações do Pedido</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: "#E31837", false: "#DDD" }}
            />
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowText}>Promoções e Ofertas</Text>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ true: "#E31837", false: "#DDD" }}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 0 }]}
            onPress={handleDeleteAccount}
          >
            <Text style={[styles.rowText, { color: "#E31837" }]}>
              Excluir minha conta
            </Text>
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="#E31837"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Versão do Aplicativo: 1.0.0</Text>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  rowText: { fontSize: 16, color: "#333" },
  version: { textAlign: "center", color: "#999", marginTop: 40 },
});
