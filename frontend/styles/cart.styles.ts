import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24, // Aumentado para dar mais respiro
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26, // Ligeiramente maior
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  // --- LISTA DE ITENS ---
  cartItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 40,
    paddingHorizontal: 2,
  },
  imageContainer: {
    width: 70, // Tamanho reduzido
    height: 70,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    height: 70, // Alinhado com a altura da imagem
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  unitPriceText: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 2,
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  qtyLabelContainer: {
    minWidth: 40, // Espaço para não "empurrar" os botões quando o número cresce
    alignItems: "center",
    paddingHorizontal: 8,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  removeButtonText: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  // --- RESUMO E FINALIZAÇÃO ---
  footerContainer: {
    padding: 20,
    paddingBottom: 30, // Espaço extra para o final da tela
    borderTopLeftRadius: 24, // Arredondar o container de checkout
    borderTopRightRadius: 24,
    backgroundColor: "#FFF",
    // Sombra para o footer parecer "subir" sobre a lista
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  subtotalLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  subtotalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#E31837",
  },
  checkoutButton: {
    backgroundColor: "#E31837",
    paddingVertical: 16,
    borderRadius: 30, // De 2 para 30 (Botão Pílula)
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  checkoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyCartText: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
    color: "#BBB",
    fontWeight: "500",
  },
});
