import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "@/styles/orders.styles";

import { OrdersService } from "@/services/orders";
import { Toast } from "@/util/toast";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderDetails = async (isInitial = true) => {
    try {
      if (isInitial) setLoading(true); // Só ativa o loader central se for a primeira carga
      const data = await OrdersService.getOrderDetails(id);
      setOrder(data);
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
      Toast.show({
        type: "error",
        text1: "Ops!",
        text2: "Não foi possível carregar o pedido.",
      });
      router.back();
    } finally {
      setLoading(false);
      setRefreshing(false); // Garante que o spinner de topo pare
    }
  };

  useEffect(() => {
    fetchOrderDetails(true);
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails(false);
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancelar Pedido",
      "Tem certeza que deseja cancelar este pedido?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              setCanceling(true);
              await OrdersService.cancelOrder(id);

              // SUBSTITUÍDO: Toast de Sucesso no lugar do Alert
              Toast.show({
                type: "success",
                text1: "Pedido Cancelado",
                text2: "O seu pedido foi cancelado com sucesso.",
              });

              fetchOrderDetails(); // Recarrega para atualizar o status na tela
            } catch (error: any) {
              // SUBSTITUÍDO: Toast de Erro no lugar do Alert
              Toast.show({
                type: "error",
                text1: "Erro ao cancelar",
                text2: error.message || "Tente novamente mais tarde.",
              });
            } finally {
              setCanceling(false);
            }
          },
        },
      ],
    );
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pendente", color: "#FFA000", bg: "#FFF8E1" };
      case "cancelled":
        return { label: "Cancelado", color: "#E31837", bg: "#FDEDED" };
      default:
        return { label: status, color: "#666", bg: "#F5F5F5" };
    }
  };

  if (loading || !order) {
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

  const badge = getStatusBadge(order.status);
  const isPickup = !order.addresses; // Se não tem address, é retirada

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E31837"]}
            tintColor="#E31837"
          />
        }
      >
        {/* RESUMO DO STATUS */}
        <View style={styles.section}>
          <Text style={styles.orderIdTitle}>
            Pedido #{order.id.substring(0, 8).toUpperCase()}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: badge.bg,
                alignSelf: "flex-start",
                marginTop: 8,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: badge.color }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* LISTA DE ITENS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens</Text>
          {order.order_items?.map((item: any) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <Text style={styles.itemQty}>
                  {item.quantity
                    ? `${item.quantity}x unitário`
                    : `${item.weight}g`}{" "}
                  • {formatPrice(item.product_price)}
                </Text>
              </View>
              <Text style={styles.itemSubtotal}>
                {formatPrice(item.subtotal)}
              </Text>
            </View>
          ))}
        </View>

        {/* ENDEREÇO / RETIRADA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entrega</Text>
          {isPickup ? (
            <View style={styles.addressBox}>
              <MaterialCommunityIcons
                name="storefront"
                size={24}
                color="#E31837"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.addressTitle}>Retirada na Loja</Text>
                <Text style={styles.addressText}>
                  R. São José dos Pinhais, 187
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.addressBox}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={24}
                color="#E31837"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.addressTitle}>
                  {order.addresses.street}, {order.addresses.number}
                </Text>
                <Text style={styles.addressText}>
                  {order.addresses.neighborhood} - {order.addresses.city}/
                  {order.addresses.state}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* TOTAIS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(
                Number(order.total_price) - Number(order.delivery_fee),
              )}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de Entrega</Text>
            <Text style={styles.summaryValue}>
              {order.delivery_fee > 0
                ? formatPrice(order.delivery_fee)
                : "Grátis"}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Pago</Text>
            <Text style={styles.totalValue}>
              {formatPrice(order.total_price)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTÃO DE CANCELAR (Se pendente) */}
      {order.status === "pending" && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
            disabled={canceling}
          >
            {canceling ? (
              <ActivityIndicator color="#E31837" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
