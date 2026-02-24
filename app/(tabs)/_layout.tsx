import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Platform, View, Text } from "react-native";
import { useCart } from "@/context/CartContext"; // Usando o hook do seu contexto

/**
 * Cores da marca do e-commerce de cereais
 */
const BRAND_COLORS = {
  primary: "#E31837", // Vermelho principal
  inactive: "#8E8E8E", // Cinza para abas inativas
  background: "#FFFFFF",
  border: "#F0F0F0",
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

// NOVO: Componente customizado para o ícone do carrinho com a "bolinha" (badge)
function CartIconWithBadge({ color }: { color: string }) {
  const { cartCount } = useCart(); // Busca a contagem global em tempo real

  return (
    <View>
      <FontAwesome name="shopping-cart" size={22} color={color} style={{ marginBottom: -3 }} />
      
      {/* Só mostra a bolinha se tiver mais de 0 itens */}
      {cartCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -10,
            top: -6,
            backgroundColor: BRAND_COLORS.primary,
            borderRadius: 10,
            width: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: BRAND_COLORS.background, // Dá um recorte bonito em cima do ícone
          }}
        >
          <Text style={{ color: "white", fontSize: 9, fontWeight: "bold" }}>
            {cartCount > 99 ? "99+" : cartCount}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // 1. Remove o header padrão
        headerShown: false,
        // 2. Cores das abas
        tabBarActiveTintColor: BRAND_COLORS.primary,
        tabBarInactiveTintColor: BRAND_COLORS.inactive,
        // 3. Estilo da barra inferior (Minimalista estilo Amazon)
        tabBarStyle: {
          backgroundColor: BRAND_COLORS.background,
          borderTopWidth: 1,
          borderTopColor: BRAND_COLORS.border,
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      {/* Buscar */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />

      {/* Carrinho */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrinho",
          // Substituímos o ícone padrão pelo nosso ícone com Badge
          tabBarIcon: ({ color }) => <CartIconWithBadge color={color} />,
        }}
      />

      {/* Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}