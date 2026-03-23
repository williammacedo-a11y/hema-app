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
import { Toast } from "@/util/toast";
import { styles } from "@/styles/profile.styles";
import { getCurrentUser, updateUserProfile } from "@/services/auth";

export default function PersonalDetailsScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setEmail(user.email || "");
          setName(user.user_metadata?.name || "");
          setPhone(user.user_metadata?.phone || "");
          setCpf(user.user_metadata?.cpf || "");

          // DICA: Se você quiser garantir que o nome vem do profiles e não do auth,
          // você pode fazer um supabase.from('profiles').select('name').eq('id', user.id) aqui.
        }
      } catch (error) {
        Toast.show({ type: "error", text1: "Erro ao carregar dados" });
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
    try {
      await updateUserProfile({ name, phone, cpf, email });

      Toast.show({
        type: "success",
        text1: "Dados atualizados com sucesso!",
      });
      router.back();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar",
        text2: error.message,
      });
    } finally {
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

      {/* CABEÇALHO FIXO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Meus Dados</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTEÚDO */}
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled" // Deixa clicar no salvar sem precisar fechar o teclado antes
        keyboardDismissMode="on-drag" // Fecha o teclado ao arrastar a tela (Padrão ouro do iOS/Android)
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
          />
        </View>
      </ScrollView>

      {/* RODAPÉ FIXO */}
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
