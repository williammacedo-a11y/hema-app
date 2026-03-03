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
  listContent: {
    paddingBottom: 30,
  },
  cartItem: {
    flexDirection: "row",
    padding: 12, // Adicionado padding interno
    backgroundColor: "#FFF",
    borderRadius: 16, // Item agora é um card arredondado
    marginBottom: 16,
    // Sombra leve para destacar os itens do fundo
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: "#F9F9F9",
    borderRadius: 12, // De 2 para 12
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  // --- CONTROLE DE QUANTIDADE ---
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Fundo cinza claro para o controle todo
    borderRadius: 25, // Formato de pílula
    padding: 2,
    borderWidth: 0, // Removida a borda dura
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    // Pequena sombra no botão de + e -
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E31837", // Usei o vermelho da marca para os controles
  },
  qtyText: {
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeButtonText: {
    fontSize: 12,
    color: "#999", // Cinza mais suave
    fontWeight: "500",
    // Removido o underline para um look mais clean,
    // mas pode manter se preferir
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
