import React from "react";
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { styles } from "@/styles/home.styles";
import { useHomeData } from "@/hooks/useHomeData";
import { HomeHeader } from "@/components/HomeHeader";
import { ProductCard } from "@/components/ProductCard";

export default function HomeScreen() {
  const router = useRouter();
  const { catalog, loading, refreshing, onRefresh, userName } = useHomeData();

  const handleAddToCart = (product: any) => {
    console.log("Adicionar ao carrinho:", product.name);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#E31837" />

      {/* HEADER ISOLADO */}
      <HomeHeader />

      <View style={styles.mainContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E31837" />
            <Text style={{ marginTop: 10, color: "#666" }}>
              Carregando catálogo...
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#E31837"]}
                tintColor="#E31837"
              />
            }
          >
            {catalog.map((category) => {
              if (!category.products || category.products.length === 0)
                return null;

              return (
                <View key={category.id} style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{category.name}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/category/[id]",
                          params: { id: category.id, name: category.name },
                        })
                      }
                    >
                      <Text style={{ color: "#E31837", fontWeight: "bold" }}>
                        Ver todos
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListContent}
                  >
                    {category.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onPress={() => router.push(`/product/${product.id}`)}
                        onAdd={() => handleAddToCart(product)}
                      />
                    ))}
                  </ScrollView>
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
