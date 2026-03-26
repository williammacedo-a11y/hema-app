import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { Toast } from "@/util/toast";

import { getAddresses, deleteAddress } from "@/services/addresses";
import { styles } from "@/styles/addresses.styles";

export default function AddressListScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAddresses = async (isInitial = false) => {
    if (isInitial) setLoading(true);

    const response = await getAddresses();

    if (response.success && response.data) {
      setAddresses(response.data);
    } else {
      setAddresses([]);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses(true);
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAddresses(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Remover endereço",
      "Tem certeza que deseja excluir este endereço?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const response = await deleteAddress(id);
            if (response.success) {
              Toast.show({ type: "success", text1: "Endereço removido!" });
              fetchAddresses();
            } else {
              Toast.show({
                type: "error",
                text1: "Erro ao remover",
                text2: response.message,
              });
            }
          },
        },
      ],
    );
  };

  const renderAddressItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => router.push(`/addresses/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.addressInfo}>
        <View style={styles.addressHeaderRow}>
          <Text style={styles.addressLabel}>{item.label || "Endereço"}</Text>
          {item.is_default && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Principal</Text>
            </View>
          )}
        </View>

        <Text style={styles.addressText}>
          {item.street}, {item.number}
        </Text>
        <Text style={styles.addressSubtext}>
          {item.neighborhood} • {item.city}/{item.state}
        </Text>
        <Text style={styles.addressSubtext}>{item.zip_code}</Text>
      </View>

      <View style={styles.addressActions}>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={22}
            color="#E31837"
          />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Endereços</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E31837" />
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddressItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E31837"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="map-marker-off-outline"
                size={64}
                color="#CCC"
              />
              <Text style={styles.emptyText}>Nenhum endereço cadastrado.</Text>
            </View>
          }
        />
      )}

      {/* BOTÃO FLUTUANTE */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/addresses/new")}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar Novo Endereço</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
