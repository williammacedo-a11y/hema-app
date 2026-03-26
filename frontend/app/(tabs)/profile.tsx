import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { styles } from "../../styles/profile.styles";
import { logout } from "../../services/auth";
import { uploadAvatar } from "../../services/profile";
import { Toast } from "@/util/toast";

const MENU_OPTIONS = [
  { id: "1", title: "Meus Pedidos", route: "/orders" },
  { id: "2", title: "Endereços de Entrega", route: "/addresses" },
  { id: "4", title: "Meus Dados", route: "/profile/details" },
  { id: "5", title: "Configurações", route: "/profile/settings" },
];

interface UserState {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserState>({
    name: "",
    email: "",
    avatarUrl: null,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const name = await AsyncStorage.getItem("@hema_user_name");
      const email = await AsyncStorage.getItem("@hema_user_email");
      const avatarUrl = await AsyncStorage.getItem("@hema_user_avatar");

      if (name && email) {
        setUser({ name, email, avatarUrl });
      }
    }

    loadProfile();
  }, []);

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      await AsyncStorage.clear();
      router.replace("/auth");
    } else {
      Toast.show({
        type: "error",
        text1: "Erro ao sair",
        text2: response.message,
      });
    }
  };

  const handlePickImage = async () => {
    // 1. Pede permissão
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permissão",
        "Precisamos de acesso à sua galeria para alterar a foto.",
      );
      return;
    }

    // 2. Abre a galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      const asset = result.assets[0];

      const fileData = {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `avatar-${Date.now()}.jpg`,
      };

      const response = await uploadAvatar(fileData);

      if (response.success && response.data) {
        setUser((prev) => ({ ...prev, avatarUrl: response.data as string }));
        await AsyncStorage.setItem(
          "@hema_user_avatar",
          response.data as string,
        );
        Toast.show({ type: "success", text1: response.message });
      } else {
        Toast.show({ type: "error", text1: "Ops!", text2: response.message });
      }

      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
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
          {/* SEÇÃO SUPERIOR: Avatar e Infos */}
          <View style={styles.headerSection}>
            <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  {
                    overflow: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                {uploading ? (
                  <ActivityIndicator color="#E31837" />
                ) : user.avatarUrl ? (
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {getInitials(user.name)}
                  </Text>
                )}
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  backgroundColor: "#E31837",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={14}
                  color="#FFF"
                />
              </View>
            </TouchableOpacity>

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
                onPress={() => {
                  if (item.route) router.push(item.route as any);
                }}
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
