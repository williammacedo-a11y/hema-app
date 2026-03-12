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
  },
  welcomeText: {
    color: "#FFF",
    fontSize: 13,
    opacity: 0.75,
    marginBottom: 4,
  },
  userName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  searchPlaceholder: {
    height: 46,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Fundo semi-transparente
    borderRadius: 24,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  searchPlaceholderText: {
    color: "#FFF",
    opacity: 0.8,
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
