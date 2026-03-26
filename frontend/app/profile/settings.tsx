import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "@/styles/profile.styles";
import { Toast } from "@/util/toast";
import { getCurrentUser } from "@/services/auth";
import { updateProfile, deleteAccount } from "@/services/profile";

export default function SettingsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const response = await getCurrentUser();

      if (response.success && response.data) {
        const user = response.data;
        const userSettings = user.user_metadata?.settings;
        if (userSettings) {
          setNotifications(userSettings.notifications ?? true);
          setPromotions(userSettings.promotions ?? false);
        }
      }

      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);

    const response = await updateProfile({
      settings: {
        notifications,
        promotions,
      },
    });

    if (response.success) {
      Toast.show({ type: "success", text1: "Configurações salvas!" });
    } else {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar",
        text2: response.message,
      });
    }
    setSaving(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza? Todos os seus dados de pedidos e endereços serão removidos permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const response = await deleteAccount();

            if (response.success) {
              Toast.show({ type: "success", text1: "Conta removida." });
              router.replace("/auth");
            } else {
              Toast.show({
                type: "error",
                text1: "Erro ao excluir",
                text2: response.message,
              });
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#E31837" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
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

        <Text style={styles.sectionTitle}>Privacidade e Conta</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 0 }]}
            onPress={handleDeleteAccount}
          >
            <Text
              style={[styles.rowText, { color: "#E31837", fontWeight: "600" }]}
            >
              Excluir minha conta
            </Text>
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="#E31837"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Versão do Aplicativo: 1.0.2 (Beta)</Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar Preferências</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
