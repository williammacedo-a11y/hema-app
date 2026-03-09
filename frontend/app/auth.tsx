import React, { useState, useEffect } from "react";
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
import { styles } from "../styles/auth.styles";
import { login } from "../services/auth";
import { signup } from "../services/auth";
import { useRouter } from "expo-router";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLogin(!isLogin);
    if (!isLogin) setName("");
    setPassword("");
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>HEMA</Text>
            <Text style={styles.subtitle}>
              Alimentos naturais entregues na sua casa
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {!isLogin && (
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
                  autoCapitalize="words"
                />
              </View>
            )}

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

            {/* Botão Principal */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={isLogin ? handleLogin : handleSignup}
            >
              <Text style={styles.primaryButtonText}>
                {isLogin ? "Entrar" : "Criar conta"}
              </Text>
            </TouchableOpacity>

            {/* Botão Secundário */}
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.6}
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
