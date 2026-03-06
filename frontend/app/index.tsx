import { Redirect } from "expo-router";

export default function Index() {
  // No futuro, você pode colocar uma lógica aqui:
  // const isUserLoggedIn = checkAuth();
  // if (isUserLoggedIn) return <Redirect href="/home" />;

  // Por enquanto, manda todo mundo direto para a tela de autenticação:
  return <Redirect href="/auth" />;
}
