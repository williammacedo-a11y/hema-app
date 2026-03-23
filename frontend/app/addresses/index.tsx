import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAddresses, deleteAddress, Address } from "@/services/addresses";
import { Toast } from "@/util/toast";

export default function AddressesListScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAddresses = async (showCentralLoading = true) => {
    try {
      if (showCentralLoading) setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os endereços.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false); // Garante que o spinner de topo pare
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAddresses(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, []),
  );

  const handleDelete = (id: string, is_default: boolean) => {
    if (is_default) {
      Alert.alert(
        "Atenção",
        "Você não pode excluir o endereço padrão. Defina outro como padrão primeiro.",
      );
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja apagar este endereço?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(id);
              Toast.show({ type: "success", text1: "Endereço excluído." });
              fetchAddresses();
            } catch (err) {
              Toast.show({
                type: "error",
                text1: "Erro ao excluir endereço",
              });
            }
          },
        },
      ],
    );
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: item.is_default ? "#E31837" : "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#111827" }}
            >
              {item.label || "Meu Endereço"}
            </Text>
            {item.is_default && (
              <View
                style={{
                  backgroundColor: "#FEF2F2",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{ fontSize: 10, color: "#E31837", fontWeight: "600" }}
                >
                  PADRÃO
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 20 }}>
            {item.street}, {item.number}
            {item.complement ? ` - ${item.complement}` : ""}
          </Text>
          <Text style={{ fontSize: 14, color: "#4B5563" }}>
            {item.neighborhood} - {item.city}/{item.state}
          </Text>
          <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
            CEP: {item.zip_code}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push(`/addresses/${item.id}` as any)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pencil-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.is_default)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={item.is_default ? "#D1D5DB" : "#EF4444"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111827" }}>
          Meus Endereços
        </Text>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#E31837" />
          </View>
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            renderItem={renderAddress}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#E31837"]}
                tintColor="#E31837"
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 40,
                }}
              >
                <Ionicons name="location-outline" size={64} color="#D1D5DB" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#6B7280",
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  Você ainda não tem nenhum endereço de entrega cadastrado.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: "#F9FAFB",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#E31837",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={() => router.push("/addresses/new" as any)}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            + Adicionar Novo Endereço
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
