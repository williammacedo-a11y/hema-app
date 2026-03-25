import {
  UpdateProfileRequest,
  SupportRequest,
  ServiceResponse,
} from "../types/profile";
import { supabase } from "./auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getProfileData(): Promise<ServiceResponse> {
  const API_URL = `https://${BASE_URL}/profile`;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Erro ao buscar perfil",
      };
    }

    return { success: true, message: "Sucesso", data: result.data };
  } catch (error) {
    console.error("Erro na service getProfileData:", error);
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function updateProfile(
  profile: UpdateProfileRequest,
): Promise<ServiceResponse> {
  const API_URL = `https://${BASE_URL}/profile/`;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  try {
    const response = await fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Erro ao atualizar perfil",
      };
    }

    return { success: true, message: result.message, data: result };
  } catch (error) {
    console.error("Erro na service updateProfile:", error);
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function sendSupportTicket(
  userId: string,
  data: SupportRequest,
): Promise<ServiceResponse> {
  const API_URL = `https://${BASE_URL}/profile/${userId}/support`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Erro ao enviar suporte",
      };
    }

    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, message: "Falha ao enviar mensagem." };
  }
}

// Atualize a assinatura para receber o objeto
export async function uploadAvatar(fileData: {
  uri: string;
  type: string;
  name: string;
}): Promise<ServiceResponse> {
  const API_URL = `https://${BASE_URL}/profile/avatar`;

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const formData = new FormData();

  // Passamos o objeto dinâmico aqui!
  formData.append("file", fileData as any);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`, // Sem Content-Type, o RN resolve
      },
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok)
      return { success: false, message: "Erro no upload da imagem" };

    return {
      success: true,
      message: "Foto atualizada!",
      data: result.avatar_url,
    };
  } catch (error) {
    return { success: false, message: "Erro ao processar imagem." };
  }
}

export async function deleteAccount(userId: string): Promise<ServiceResponse> {
  const API_URL = `https://${BASE_URL}/profile/${userId}`;

  try {
    const response = await fetch(API_URL, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok)
      return {
        success: false,
        message: result.message || "Erro ao excluir conta",
      };
    return { success: true, message: "Sua conta foi excluída com sucesso." };
  } catch (error) {
    return {
      success: false,
      message: "Erro de conexão ao tentar excluir conta.",
    };
  }
}
