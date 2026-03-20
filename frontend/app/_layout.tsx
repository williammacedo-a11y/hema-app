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
import { View } from "react-native";
import { ToastContainer } from "@/components/ToastContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/components/useColorScheme";
import { CartProvider } from "@/context/CartContext";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav />
    </GestureHandlerRootView>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthReady(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setIsAuthReady(true);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    // A forma mais segura de evitar loops no Expo Router é olhar apenas
    // para o PRIMEIRO segmento (o grupo principal)
    const inAuthGroup = segments[0] === "auth";

    if (session && inAuthGroup) {
      // Tem sessão salva e caiu na tela de Login? Vai direto pra Home!
      router.replace("/(tabs)/home");
    } else if (!session && !inAuthGroup) {
      // Sem sessão e está tentando acessar a Home ou Carrinho? Volta pro Login!
      router.replace("/auth");
    }

    // ⬅️ O segments PRECISA ficar aqui para o router reagir quando terminar de carregar
  }, [session, isAuthReady, segments]);

  if (!isAuthReady) {
    return null; // Oculta tudo até o Supabase responder se tem token ou não
  }

  return <>{children}</>;
}
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
            </Stack>
          </AuthGuard>
          <ToastContainer />
        </View>
      </CartProvider>
    </ThemeProvider>
  );
}
