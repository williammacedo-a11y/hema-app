import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { styles } from "@/styles/orders.styles";

import { OrdersService } from "@/services/orders";

export default function OrdersListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await OrdersService.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendente",
          color: "#FFA000",
          bg: "#FFF8E1",
          icon: "clock-outline",
        };
      case "cancelled":
        return {
          label: "Cancelado",
          color: "#E31837",
          bg: "#FDEDED",
          icon: "cancel",
        };
      default:
        return {
          label: status,
          color: "#666",
          bg: "#F5F5F5",
          icon: "information-outline",
        };
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E31837"]}
          />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="receipt" size={64} color="#CCC" />
            <Text style={styles.emptyText}>
              Você ainda não fez nenhum pedido.
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/(tabs)/home")}
            >
              <Text style={styles.shopButtonText}>Ir para a loja</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const itemsCount = order.order_items?.length || 0;
            const firstItemName =
              order.order_items?.[0]?.product_name || "Itens do pedido";

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.card}
                onPress={() => router.push(`/orders/${order.id}` as any)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.orderId}>
                    Pedido #{order.id.substring(0, 8).toUpperCase()}
                  </Text>
                  <Text style={styles.orderDate}>
                    {formatDate(order.created_at)}
                  </Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.itemPreview} numberOfLines={1}>
                    {itemsCount > 1
                      ? `${firstItemName} e mais ${itemsCount - 1} item(ns)`
                      : firstItemName}
                  </Text>
                  <Text style={styles.orderTotal}>
                    {formatPrice(order.total_price)}
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <View
                    style={[styles.statusBadge, { backgroundColor: badge.bg }]}
                  >
                    <MaterialCommunityIcons
                      name={badge.icon as any}
                      size={14}
                      color={badge.color}
                    />
                    <Text style={[styles.statusText, { color: badge.color }]}>
                      {badge.label}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#999"
                  />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
