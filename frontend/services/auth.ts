import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
);

// Função auxiliar para salvar no "cache"
const saveUserCache = async (name: string) => {
  try {
    await AsyncStorage.setItem('@hema_user_name', name);
  } catch (e) {
    console.error("Erro ao salvar cache", e);
  }
};

export async function signup(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) throw error;
  
  if (data.user?.user_metadata?.name) {
    await saveUserCache(data.user.user_metadata.name);
  }

  return data;
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const userName = data.user?.user_metadata?.name;
  if (userName) {
    await saveUserCache(userName);
  }

  return data;
}