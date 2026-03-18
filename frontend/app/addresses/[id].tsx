import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  getAddresses,
  getAddressByCep,
  createAddress,
  updateAddress,
} from "@/services/addresses";

export default function AddressFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = id && id !== "new";

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [label, setLabel] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadAddressData();
    }
  }, [id]);

  const loadAddressData = async () => {
    try {
      setLoading(true);
      const addresses = await getAddresses();
      const addr = addresses.find((a) => a.id === id);
      if (addr) {
        setLabel(addr.label || "");
        setZipCode(addr.zip_code || "");
        setStreet(addr.street || "");
        setNumber(addr.number || "");
        setComplement(addr.complement || "");
        setNeighborhood(addr.neighborhood || "");
        setCity(addr.city || "");
        setState(addr.state || "");
        setIsDefault(addr.is_default || false);
      } else {
        Alert.alert("Erro", "Endereço não encontrado.");
        router.back();
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: "error", text1: "Não foi possível carregar os dados" });
    } finally {
      setLoading(false);
    }
  };

  const handleCepSearch = async () => {
    if (zipCode.replace(/\D/g, "").length !== 8) return;

    try {
      setLoadingCep(true);
      const data = await getAddressByCep(zipCode);
      if (data) {
        setStreet(data.street);
        setNeighborhood(data.neighborhood);
        setCity(data.city);
        setState(data.state);
        Toast.show({ type: "success", text1: "CEP encontrado" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "CEP inválido ou não encontrado." });
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSave = async () => {
    if (!zipCode || !street || !number || !neighborhood || !city || !state) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        label,
        zip_code: zipCode,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        is_default: isDefault,
      };

      if (isEditing) {
        await updateAddress(id as string, payload);
        Toast.show({ type: "success", text1: "Endereço atualizado!" });
      } else {
        await createAddress(payload);
        Toast.show({ type: "success", text1: "Endereço adicionado!" });
      }
      
      router.back();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro ao salvar",
        text2: "Verifique os dados e tente novamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E31837" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", backgroundColor: "#fff" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111827" }}>
            {isEditing ? "Editar Endereço" : "Novo Endereço"}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
              IDENTIFICAÇÃO DO LOCAL
            </Text>
            <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
              <TextInput
                placeholder="Ex: Minha Casa, Trabalho, Casa da Mãe..."
                style={{ height: 50, fontSize: 15, color: "#111827" }}
                value={label}
                onChangeText={setLabel}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                CEP *
              </Text>
              <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
                <TextInput
                  placeholder="00000-000"
                  keyboardType="numeric"
                  maxLength={9}
                  style={{ height: 50, fontSize: 15, color: "#111827" }}
                  value={zipCode}
                  onChangeText={setZipCode}
                  onBlur={handleCepSearch}
                />
              </View>
            </View>
            {loadingCep && (
              <View style={{ marginTop: 24 }}>
                <ActivityIndicator size="small" color="#E31837" />
              </View>
            )}
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>Rua/Avenida *</Text>
            <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
              <TextInput
                placeholder="Av. Paulista..."
                style={{ height: 50, fontSize: 15, color: "#111827" }}
                value={street}
                onChangeText={setStreet}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>Número *</Text>
              <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
                <TextInput
                  placeholder="Ex: 1000"
                  style={{ height: 50, fontSize: 15, color: "#111827" }}
                  value={number}
                  onChangeText={setNumber}
                />
              </View>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>Complemento</Text>
              <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
                <TextInput
                  placeholder="Apto, Bloco..."
                  style={{ height: 50, fontSize: 15, color: "#111827" }}
                  value={complement}
                  onChangeText={setComplement}
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>Bairro *</Text>
            <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
              <TextInput
                placeholder="Ex: Centro"
                style={{ height: 50, fontSize: 15, color: "#111827" }}
                value={neighborhood}
                onChangeText={setNeighborhood}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 16, marginBottom: 30 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>Cidade *</Text>
              <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
                <TextInput
                  placeholder="Ex: São Paulo"
                  style={{ height: 50, fontSize: 15, color: "#111827" }}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>UF *</Text>
              <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12 }}>
                <TextInput
                  placeholder="SP"
                  maxLength={2}
                  autoCapitalize="characters"
                  style={{ height: 50, fontSize: 15, color: "#111827" }}
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#E5E7EB" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
                Tornar como padrão
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                Este endereço será o principal em suas compras.
              </Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: "#D1D5DB", true: "#FECDD3" }}
              thumbColor={isDefault ? "#E31837" : "#F9FAFB"}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#E5E7EB" }}>
        <TouchableOpacity
          style={{ backgroundColor: saving ? "#F87171" : "#E31837", padding: 16, borderRadius: 12, alignItems: "center" }}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {isEditing ? "Salvar Alterações" : "Adicionar Endereço"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
