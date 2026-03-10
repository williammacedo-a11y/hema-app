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
} from "react-native";
import { Stack, useRouter } from "expo-router"; 
import { styles } from "../styles/auth.styles";
import { login, signup } from "../services/auth";
import { View as MotiView, Text as MotiText, AnimatePresence } from "moti";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLogin(!isLogin);
  };

  async function handleLogin() {
    try {
      const res = await login(email, password);

      const token = res.session?.access_token;

      if (token) {
        setToken(token);
        router.navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSignup() {
    try {
      const res = await signup(email, password, name);

      const token = res.session?.access_token;

      if (token) {
        setToken(token);
        router.navigate("/home");
      }
    } catch (err) {
      console.log(err);
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
            {/* O segredo está aqui: AnimatePresence gerencia a entrada e saída */}
            <AnimatePresence exitBeforeEnter>
              {!isLogin && (
                <MotiView
                  key="name-input"
                  from={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 70, marginBottom: 15 }} // Ajuste o height conforme seu estilo
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ type: "timing", duration: 250 }}
                  style={{ overflow: "hidden" }} // Impede o texto de vazar na animação
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
                    />
                  </View>
                </MotiView>
              )}
            </AnimatePresence>

            {/* Email e Senha podem ser fixos ou animados também */}
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
              />
            </View>

            {/* Botão Principal com transição de texto suave */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={isLogin ? handleLogin : handleSignup}
            >
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
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleMode}
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
