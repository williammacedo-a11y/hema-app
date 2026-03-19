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

    const path = segments.join("/");
    const isAuthRoute = path.startsWith("auth");

    if (!session && !isAuthRoute) {
      router.replace("/auth");
    }

    if (session && isAuthRoute) {
      router.replace("/(tabs)/home");
    }
  }, [session, isAuthReady]); // ❗ REMOVE segments daqui

  if (!isAuthReady) {
    return null; // ❗ NUNCA overlay
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
          <Toast config={toastConfig} position="top" topOffset={60} />
        </View>
      </CartProvider>
    </ThemeProvider>
  );
}
