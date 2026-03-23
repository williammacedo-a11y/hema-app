import React from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { styles } from "@/styles/product.styles";
import { PulseView } from "./PulseView";
const { width } = Dimensions.get("window");

export function ProductDetailsSkeleton() {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
      >
        {/* Skeleton da Imagem Principal */}
        <PulseView style={{ width: width, height: width }} />

        <View style={styles.detailsContainer}>
          {/* Categoria */}
          <PulseView
            style={{ height: 12, width: 80, borderRadius: 4, marginBottom: 12 }}
          />

          {/* Nome do Produto */}
          <PulseView
            style={{
              height: 28,
              width: "90%",
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
          <PulseView
            style={{
              height: 28,
              width: "60%",
              borderRadius: 6,
              marginBottom: 20,
            }}
          />

          {/* Preço */}
          <PulseView
            style={{
              height: 35,
              width: 140,
              borderRadius: 6,
              marginBottom: 30,
            }}
          />

          <View style={styles.divider} />

          {/* Título Descrição */}
          <PulseView
            style={{
              height: 18,
              width: 100,
              borderRadius: 4,
              marginBottom: 12,
            }}
          />

          {/* Linhas de Descrição */}
          <PulseView
            style={{
              height: 14,
              width: "100%",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <PulseView
            style={{
              height: 14,
              width: "100%",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <PulseView
            style={{
              height: 14,
              width: "80%",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
        </View>

        {/* Skeleton de Similares */}
        <View style={{ margin: 20 }}>
          <PulseView
            style={{
              height: 18,
              width: 150,
              borderRadius: 4,
              marginBottom: 15,
            }}
          />
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 12 }}>
              <PulseView style={{ width: 60, height: 60, borderRadius: 8 }} />
              <View
                style={{ marginLeft: 10, flex: 1, justifyContent: "center" }}
              >
                <PulseView
                  style={{
                    height: 14,
                    width: "70%",
                    borderRadius: 4,
                    marginBottom: 6,
                  }}
                />
                <PulseView
                  style={{ height: 14, width: "40%", borderRadius: 4 }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão de Rodapé Skeleton */}
      <View style={styles.footer}>
        <PulseView style={[styles.addButton, { backgroundColor: "#E0E0E0" }]} />
      </View>
    </View>
  );
}
