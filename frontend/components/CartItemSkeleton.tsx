import React from "react";
import { View } from "react-native";
import { styles } from "@/styles/cart.styles";
import { PulseView } from "./PulseView"; // Nosso motor de animação

export function CartItemSkeleton() {
  return (
    <View style={{ marginBottom: 15 }}>
      <View style={[styles.cartItem, { marginBottom: 0 }]}>
        {/* Imagem Quadrada */}
        <PulseView style={[styles.imageContainer, { borderRadius: 8 }]} />

        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              {/* Nome do Produto */}
              <PulseView
                style={{
                  height: 16,
                  width: "80%",
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
              {/* Preço Unitário */}
              <PulseView
                style={{ height: 12, width: "40%", borderRadius: 4 }}
              />
            </View>
            {/* Preço Total da Linha */}
            <PulseView style={{ height: 18, width: 60, borderRadius: 4 }} />
          </View>

          <View style={[styles.itemFooter, { marginTop: 15 }]}>
            {/* Controles de Quantidade */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <PulseView style={{ height: 28, width: 28, borderRadius: 14 }} />
              <PulseView style={{ height: 16, width: 20, borderRadius: 4 }} />
              <PulseView style={{ height: 28, width: 28, borderRadius: 14 }} />
            </View>

            {/* Botão Remover */}
            <PulseView style={{ height: 16, width: 60, borderRadius: 4 }} />
          </View>
        </View>
      </View>
    </View>
  );
}
