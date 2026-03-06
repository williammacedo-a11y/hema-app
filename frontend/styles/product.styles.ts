import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const BRAND_PRIMARY = "#E31837";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 100, // Espaço para o rodapé fixo
  },
  imageContainer: {
    width: width,
    height: width, // Imagem quadrada ocupando a tela toda
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImageText: {
    color: "#999",
    marginTop: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  categoryText: {
    color: BRAND_PRIMARY,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 24,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: BRAND_PRIMARY,
  },
  unitText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  // --- RODAPÉ FIXO ---
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    flexDirection: "row",
    gap: 15,
  },
  addButton: {
    flex: 1,
    backgroundColor: BRAND_PRIMARY,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
