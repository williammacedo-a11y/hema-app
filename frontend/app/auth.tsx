import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { styles } from "../styles/auth.styles";
import { login, signup } from "../services/auth";
import { View as MotiView, Text as MotiText, AnimatePresence } from "moti";
import { Toast } from "@/util/toast";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLogin(!isLogin);
  };

  async function handleLogin() {
    if (!email || !password) {
      return Toast.show({ type: "error", text1: "Preencha todos os campos." });
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao entrar",
        text2: "E-mail ou senha incorretos.",
      });
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignup() {
    if (!email || !password || !name) {
      return Toast.show({ type: "error", text1: "Preencha todos os campos." });
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await signup(email, password, name);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao criar conta",
        text2: err.message || "Tente novamente mais tarde.",
      });
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <MotiText
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.logo}
            >
              HEMA
            </MotiText>
            <Text style={styles.subtitle}>
              Alimentos naturais entregues na sua casa
            </Text>
          </View>

          <View style={styles.form}>
            <AnimatePresence exitBeforeEnter>
              {!isLogin && (
                <MotiView
                  key="name-input"
                  from={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 70, marginBottom: 15 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ type: "timing", duration: 250 }}
                  style={{ overflow: "hidden" }}
                >
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedInput === "name" && styles.inputWrapperFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Nome completo"
                      placeholderTextColor="#999"
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedInput("name")}
                      onBlur={() => setFocusedInput(null)}
                      editable={!isLoading}
                    />
                  </View>
                </MotiView>
              )}
            </AnimatePresence>

            <View
              style={[
                styles.inputWrapper,
                focusedInput === "email" && styles.inputWrapperFocused,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View
              style={[
                styles.inputWrapper,
                focusedInput === "password" && styles.inputWrapperFocused,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <View style={{ marginTop: 24 }} />

            <TouchableOpacity
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={isLogin ? handleLogin : handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <AnimatePresence exitBeforeEnter>
                  <MotiText
                    key={isLogin ? "login-txt" : "signup-txt"}
                    from={{ opacity: 0, translateY: 5 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -5 }}
                    style={styles.primaryButtonText}
                  >
                    {isLogin ? "Entrar" : "Criar conta"}
                  </MotiText>
                </AnimatePresence>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleMode}
              disabled={isLoading}
            >
              <Text style={styles.secondaryText}>
                {isLogin ? "Ainda não tem conta? " : "Já tenho conta. "}
                <Text style={styles.secondaryTextBold}>
                  {isLogin ? "Criar conta" : "Entrar"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
