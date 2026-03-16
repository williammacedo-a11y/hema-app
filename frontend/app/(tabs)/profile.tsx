import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

// Importação dos estilos separados
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles/profile.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../../services/auth";
import { router } from "expo-router";

const MENU_OPTIONS = [
  { id: "1", title: "Meus Pedidos" },
  { id: "2", title: "Endereço de Entrega" },
  { id: "3", title: "Formas de Pagamento" },
  { id: "4", title: "Meus Dados" },
  { id: "5", title: "Configurações" },
  { id: "6", title: "Ajuda e Suporte" },
];

interface UserState {
  name: string;
  email: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserState>({
    name: "",
    email: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const name = await AsyncStorage.getItem("@hema_user_name");
      const email = await AsyncStorage.getItem("@hema_user_email");
      if (name && email) {
        setUser((user) => ({ ...user, name, email }));
      }
    }

    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.clear();
      router.replace("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";

    const names = name.trim().split(" ");

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção Superior: Avatar e Infos */}
          <View style={styles.headerSection}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* Seção de Menu */}
          <View style={styles.menuSection}>
            {MENU_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.6}
              >
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botão Sair */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
