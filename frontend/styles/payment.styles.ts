import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Um cinza bem claro para dar contraste com os cards brancos
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentPadding: {
    paddingHorizontal: 20,
  },

  // Resumo do Pedido (Estilo Recibo)
  summaryCard: {
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row", // Alinha textos e valor lado a lado
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    width: "100%", // Garante que o card ocupe a largura total
  },

  // NOVA CLASSE: Controla o lado esquerdo (ID e Nome)
  summaryTextContainer: {
    flex: 1, // Isso obriga o texto a ocupar APENAS o espaço disponível, sem empurrar o valor
    marginRight: 10, // Espaço entre o texto e o preço
  },

  // NOVA CLASSE: Controla o lado direito (Valor)
  summaryValueContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 100, // Garante um espaço mínimo para o preço não quebrar
  },

  summaryLabel: {
    color: "#999",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#E31837",
    textAlign: "right", // Alinha o preço à direita
  },
  // Info Box (Alerta)
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FFF1F2",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFDFE1",
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#C0162D",
    lineHeight: 20,
    fontWeight: "500",
  },

  paymentMethodContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
  },

  // Estilos PIX
  qrCodeWrapper: {
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    alignSelf: "center",
    width: width * 0.8, // Proporção baseada na largura da tela
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  qrCodePlaceholder: {
    padding: 10,
    backgroundColor: "#FFF",
  },
  qrInstructions: {
    marginTop: 16,
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },

  copyPasteArea: {
    width: "100%",
    marginTop: 8,
  },
  copyLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontWeight: "500",
  },
  copyButton: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#EEE",
    borderStyle: "dashed", // Estilo cupom/pix
  },
  pixCodeText: {
    flex: 1,
    marginRight: 10,
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "600",
  },

  // Estilos Cartão
  cardForm: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 54, // Altura padrão Apple/Google
    borderRadius: 12,
    fontSize: 16,
    color: "#1A1A1A",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },

  // Botão Principal (Call to Action)
  mainButton: {
    backgroundColor: "#E31837",
    marginHorizontal: 20,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 32,
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mainButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
