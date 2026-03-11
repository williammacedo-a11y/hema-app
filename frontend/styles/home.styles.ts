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
    paddingTop: 16,
    paddingBottom: 20,
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
  // --- PRODUCT CARD ---
  productCard: {
    backgroundColor: "#FFF",
    width: 150, // Tamanho fixo para o carrossel
    marginRight: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  productImage: {
    height: 120,
    backgroundColor: "#FBFBFB",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    color: "#222",
    height: 36,
    marginBottom: 4,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#E31837",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  // --- LOADING ---
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
