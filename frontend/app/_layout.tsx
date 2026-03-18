import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { supabase } from "@/services/auth";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ErrorToast, SuccessToast } from "@/components/CustomToast";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/components/useColorScheme";
import { CartProvider } from "@/context/CartContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

const toastConfig = {
  success: (props: any) => <SuccessToast {...props} />,
  error: (props: any) => <ErrorToast {...props} />,
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Busca a sessão inicial rápida
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthReady(true);
    });

    // Ouve as mudanças de auth de forma global, apenas 1 vez
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setIsAuthReady(true);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Efeito isolado para tratar a navegação protegida sempre que segmentos ou a sessão mudarem
  useEffect(() => {
    if (!isAuthReady) return;

    const currentSegment = segments[0];
    const isPublicRoute = currentSegment === "auth";

    if (!session && !isPublicRoute) {
      router.replace("/auth");
    } else if (session && isPublicRoute) {
      router.replace("/(tabs)/home");
    }
  }, [session, segments, isAuthReady]);

  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E31837" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <CartProvider>
          <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              <Stack.Screen name="checkout" options={{ headerShown: false }} />
              <Stack.Screen name="addresses/index" options={{ headerShown: false }} />
              <Stack.Screen name="addresses/[id]" options={{ headerShown: false }} />
              <Stack.Screen
                name="product/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
            <Toast config={toastConfig} position="top" topOffset={60} />
          </View>
        </CartProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
