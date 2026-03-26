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
import { Toast } from "@/util/toast";
import {
  getAddresses,
  getAddressByCep,
  createAddress,
  updateAddress,
} from "@/services/addresses";
import { styles } from "@/styles/addresses.styles";

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
    if (isEditing) loadAddressData();
  }, [id]);

  const loadAddressData = async () => {
    setLoading(true);
    const response = await getAddresses();

    if (response.success && response.data) {
      const addr = response.data.find((a: any) => a.id === id);
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
    }
    setLoading(false);
  };

  const handleCepSearch = async () => {
    const cleanCep = zipCode.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    const response = await getAddressByCep(cleanCep);

    if (response.success && response.data) {
      setStreet(response.data.street);
      setNeighborhood(response.data.neighborhood);
      setCity(response.data.city);
      setState(response.data.state);
      Toast.show({ type: "success", text1: "CEP encontrado" });
    }
    setLoadingCep(false);
  };

  const handleSave = async () => {
    if (!zipCode || !street || !number || !neighborhood || !city || !state) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
      return;
    }

    const executeSave = async () => {
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

      const response = isEditing
        ? await updateAddress(id as string, payload)
        : await createAddress(payload);

      if (response.success) {
        Toast.show({
          type: "success",
          text1: isEditing ? "Endereço atualizado!" : "Endereço adicionado!",
        });
        router.back();
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao salvar",
          text2: response.message,
        });
      }
      setSaving(false);
    };

    if (isDefault) {
      setSaving(true);
      const response = await getAddresses();
      if (response.success && response.data) {
        const existingDefault = response.data.find(
          (a: any) => a.is_default === true && a.id !== id,
        );
        if (existingDefault) {
          setSaving(false);
          Alert.alert(
            "Alterar padrão?",
            `O endereço "${existingDefault.label || "Meu Endereço"}" já é o padrão. Deseja tornar este o seu principal?`,
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Sim, alterar", onPress: () => executeSave() },
            ],
          );
          return;
        }
      }
    }
    executeSave();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E31837" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Editar Endereço" : "Novo Endereço"}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContent}>
          <Text style={styles.sectionTitle}>IDENTIFICAÇÃO DO LOCAL</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Ex: Minha Casa, Trabalho..."
              style={styles.input}
              value={label}
              onChangeText={setLabel}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CEP *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="00000-000"
                  keyboardType="numeric"
                  maxLength={9}
                  style={styles.input}
                  value={zipCode}
                  onChangeText={setZipCode}
                  onBlur={handleCepSearch}
                />
              </View>
            </View>
            {loadingCep && (
              <ActivityIndicator
                size="small"
                color="#E31837"
                style={{ marginTop: 25 }}
              />
            )}
          </View>

          <Text style={styles.inputLabel}>Rua/Avenida *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Av. Paulista..."
              style={styles.input}
              value={street}
              onChangeText={setStreet}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Número *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="100"
                  style={styles.input}
                  value={number}
                  onChangeText={setNumber}
                />
              </View>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.inputLabel}>Complemento</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Apto, Bloco..."
                  style={styles.input}
                  value={complement}
                  onChangeText={setComplement}
                />
              </View>
            </View>
          </View>

          <Text style={styles.inputLabel}>Bairro *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Ex: Centro"
              style={styles.input}
              value={neighborhood}
              onChangeText={setNeighborhood}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 2 }}>
              <Text style={styles.inputLabel}>Cidade *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Ex: São Paulo"
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>UF *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="SP"
                  maxLength={2}
                  autoCapitalize="characters"
                  style={styles.input}
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>
          </View>

          <View style={styles.switchContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Tornar como padrão</Text>
              <Text style={styles.switchSublabel}>
                Este endereço será o principal em suas compras.
              </Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: "#D1D5DB", true: "#FECDD3" }}
              thumbColor={isDefault ? "#E31837" : "#F9FAFB"}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? "Salvar Alterações" : "Adicionar Endereço"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
