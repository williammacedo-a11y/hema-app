import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "@/util/toast";
import { styles } from "@/styles/profile.styles";
import { getCurrentUser } from "@/services/auth";
import { updateProfile, getProfileData } from "@/services/profile";

export default function PersonalDetailsScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const userResponse = await getCurrentUser();
      if (userResponse.success && userResponse.data) {
        setEmail(userResponse.data.email || "");
      }

      const profileResponse = await getProfileData();

      if (profileResponse.success && profileResponse.data) {
        setName(profileResponse.data.name || "");
        setPhone(profileResponse.data.phone || "");
        setCpf(profileResponse.data.cpf || "");
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao carregar dados",
          text2: profileResponse.message,
        });
      }

      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!name.trim() || !email.trim()) {
      return Toast.show({
        type: "error",
        text1: "Nome e E-mail são obrigatórios",
      });
    }

    setSaving(true);

    const response = await updateProfile({
      name,
      phone,
      cpf,
    });

    if (response.success) {
      try {
        await AsyncStorage.setItem("@hema_user_name", name);
      } catch (e) {
        console.error("Erro ao salvar no AsyncStorage", e);
      }

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: response.message,
      });

      setTimeout(() => router.back(), 1500);
    } else {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar",
        text2: response.message,
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#E31837" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Meus Dados</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCorrect={false}
            placeholder="Digite seu nome"
            editable={!saving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: "#F5F5F5", color: "#888" },
            ]}
            value={email}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Celular</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!saving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
            maxLength={14}
            editable={!saving}
          />
        </View>
      </ScrollView>

      {/* RODAPÉ */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
