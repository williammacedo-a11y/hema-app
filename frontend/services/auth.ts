import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

const saveUserCache = async (name: string, email: string) => {
  try {
    await AsyncStorage.setItem("@hema_user_name", name);
    await AsyncStorage.setItem("@hema_user_email", email);
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
    await saveUserCache(
      data.user.user_metadata.name,
      data.user.user_metadata.email,
    );
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
    await saveUserCache(userName, data.user.user_metadata.email);
  }

  return data;
}

export async function updateUserProfile(updates: {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  cpf?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão expirada. Faça login novamente.");

  const { data: authData, error: authError } = await supabase.auth.updateUser({
    email: updates.email,
    password: updates.password,
    data: {
      name: updates.name,
      phone: updates.phone,
      cpf: updates.cpf,
    },
  });

  if (authError) throw authError;

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/profile/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: updates.name,
      phone: updates.phone,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erro ao atualizar perfil no backend.",
    );
  }

  if (authData.user) {
    const newName = authData.user.user_metadata?.name || updates.name;
    const newEmail = authData.user.email || updates.email;
    await saveUserCache(newName, newEmail!);
  }

  return authData;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function logout() {
  await supabase.auth.signOut();

  await AsyncStorage.removeItem("@hema_user_name");
  await AsyncStorage.removeItem("@hema_user_email");
}
