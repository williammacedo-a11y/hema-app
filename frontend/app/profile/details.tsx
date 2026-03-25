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
      try {
        const user = await getCurrentUser();
        if (user) setEmail(user.email || "");

        const profileResponse = await getProfileData();

        if (profileResponse.success && profileResponse.data) {
          setName(profileResponse.data.name || "");
          setPhone(profileResponse.data.phone || "");
          setCpf(profileResponse.data.cpf || "");
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Erro ao carregar dados do usuário",
        });
      } finally {
        setLoading(false);
      }
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
        await AsyncStorage.removeItem("@hema_user_name");
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
    }

    setSaving(false);
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
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: "#F5F5F5", color: "#888" },
            ]} // E-mail geralmente é readonly em profiles simples
            value={email}
            editable={false} // Mantendo desabilitado para evitar conflito com Auth sem re-autenticação
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
            maxLength={14} // Bom colocar limite pra evitar lixo no banco
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
