import { supabase } from "./supabase";

export async function getProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("User not authenticated");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userData.user.id)
    .single();

  if (error) {
    throw error;
  }

  return {
    name: profile?.name ?? "",
    email: userData.user.email ?? "",
  };
}
