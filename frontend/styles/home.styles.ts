import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E31837", // Fundo vermelho para o topo (SafeArea)
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  // --- HEADER & PLACEHOLDER ---
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 15,
    backgroundColor: "#E31837",
    // --- ADICIONE ESTAS LINHAS ---
    flexDirection: "row", // Alinha Logo e Busca lado a lado
    alignItems: "center", // Centraliza verticalmente
    gap: 12, // Dá um espaçamento entre a logo e a busca
  },
  searchPlaceholder: {
    height: 46,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    justifyContent: "center",
    paddingHorizontal: 20,
    flex: 1, 
  },
  searchPlaceholderText: {
    color: "#FFF",
    opacity: 0.8,
    fontSize: 14,
    marginTop: 12,
    flex: 1,
  },
  logo: {
    width: 44, // Ajuste para a altura da sua navbar
    height: 44,
    borderRadius: 22, // Metade do tamanho para ficar redonda
  },
  // --- SEÇÕES E CARROSSÉIS ---
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  horizontalListContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  // --- LOADING ---
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
