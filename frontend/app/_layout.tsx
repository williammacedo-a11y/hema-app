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
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentSegment = segments[0];

        const isPublicRoute = currentSegment === "auth";

        if (!session && !isPublicRoute) {
          // AJUSTE AQUI: Se sua pasta se chama auth, a rota é "/auth"
          router.replace("/auth");
        } else if (session && isPublicRoute) {
          router.replace("/(tabs)/home");
        }

        setIsAuthReady(true);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [segments]);

  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E31837" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[id]"
              options={{ headerShown: false }}
            />
            {/* Certifique-se de que a tela de login esteja no seu Stack se não for automática */}
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack>
          <Toast config={toastConfig} position="bottom" bottomOffset={100} />
        </View>
      </CartProvider>
    </ThemeProvider>
  );
}
