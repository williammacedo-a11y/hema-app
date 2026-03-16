import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA", // Fundo levemente mais cinza para destacar os cards brancos
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28, // Um pouco maior
    fontWeight: "800",
    color: "#111",
    letterSpacing: -0.5,
  },
  // --- LISTA DE ITENS ---
  listContent: {
    paddingBottom: 40,
  },
  cartItem: {
    flexDirection: "row",
    padding: 14, // Mais respiro interno
    backgroundColor: "#FFF",
    borderRadius: 16, // Mais arredondado
    marginBottom: 16,
    // Sombra mais suave e elegante
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
  },
  imageContainer: {
    width: 76, // Ligeiramente maior
    height: 76,
    backgroundColor: "#F9F9F9",
    borderRadius: 12, // Acompanha o shape do card
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
    marginLeft: 14,
    height: 76,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    fontSize: 15, // Mais legível
    color: "#222",
    fontWeight: "700",
    marginRight: 8, // Evita encostar no preço
  },
  unitPriceText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontWeight: "500",
  },
  itemTotalPrice: {
    fontSize: 16, // Maior destaque para o valor que o usuário vai pagar
    fontWeight: "800",
    color: "#E31837",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // --- CONTROLE DE UNIDADE (+ / -) ---
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    padding: 3, // Mais espaço em volta dos botões
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  qtyButton: {
    width: 28, // Maior área de toque
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    // Sombra sutil para dar sensação de botão "clicável"
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  qtyLabelContainer: {
    // Espaço para alinhar perfeitamente entre os botões de unidade
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  // --- CONTROLE DE PESO (Input + ✏️) ---
  weightEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8", // Mesma cor do container de unidade
    borderRadius: 20, // Mesmo border radius para manter o padrão
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    height: 36, // Altura fixa igual ao do container de unidade (28 + 3 + 3 + bordas)
  },
  weightInput: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    minWidth: 35,
    textAlign: "right",
    padding: 0,
    height: 28, // Para não esticar o container
  },
  weightUnitText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    marginLeft: 2,
    marginRight: 10,
    marginTop: 1, // Alinha visualmente com a base do número
  },
  editWeightButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  // --- BOTÃO REMOVER ---
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 6, // Maior área de toque sem afetar visual
  },
  removeButtonText: {
    fontSize: 12,
    color: "#A0A0A0", // Cinza um pouco mais leve para não brigar com a ação principal
    fontWeight: "600",
  },

  // --- RESUMO E FINALIZAÇÃO ---
  footerContainer: {
    padding: 24,
    paddingBottom: 34,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#FFF",
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  subtotalLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  subtotalValue: {
    fontSize: 24, // Maior destaque final
    fontWeight: "900",
    color: "#E31837",
    letterSpacing: -0.5,
  },
  checkoutButton: {
    backgroundColor: "#E31837",
    paddingVertical: 18, // Botão um pouco mais gordinho
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  checkoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  emptyCartText: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
    color: "#BBB",
    fontWeight: "500",
  },
});
