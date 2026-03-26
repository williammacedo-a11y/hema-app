import { apiFetch, ApiResponse } from "./api";
import { UpdateProfileRequest, SupportRequest } from "../types/profile";

export async function getProfileData(): Promise<ApiResponse<any>> {
  return apiFetch("/profile", { method: "GET" });
}

export async function updateProfile(
  profile: UpdateProfileRequest,
): Promise<ApiResponse<any>> {
  return apiFetch("/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
}

export async function sendSupportTicket(
  data: SupportRequest,
): Promise<ApiResponse<void>> {
  return apiFetch("/profile/support", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(fileData: {
  uri: string;
  type: string;
  name: string;
}): Promise<ApiResponse<string>> {
  const formData = new FormData();
  formData.append("file", fileData as any);

  return apiFetch("/profile/avatar", {
    method: "POST",
    body: formData,
    isMultipart: true,
  });
}

export async function deleteAccount(): Promise<ApiResponse<void>> {
  return apiFetch("/profile", { method: "DELETE" });
}
