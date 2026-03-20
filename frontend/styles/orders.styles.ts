import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ==========================================
  // ESTILOS COMPARTILHADOS (Usados nas duas telas)
  // ==========================================
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10, // Meio termo perfeito pras duas telas
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: { fontSize: 13, fontWeight: "bold" },

  // ==========================================
  // ESTILOS DA TELA DE LISTA (index.tsx)
  // ==========================================
  listContainer: { padding: 16, flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: { fontSize: 16, color: "#666", marginTop: 16, marginBottom: 24 },
  shopButton: {
    backgroundColor: "#E31837",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: { fontSize: 14, fontWeight: "bold", color: "#1A1A1A" },
  orderDate: { fontSize: 12, color: "#666" },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  itemPreview: { flex: 1, fontSize: 14, color: "#444", marginRight: 16 },
  orderTotal: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },

  // ==========================================
  // ESTILOS DA TELA DE DETALHES ([id].tsx)
  // ==========================================
  content: { padding: 16, paddingBottom: 40 },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orderIdTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 12,
    marginBottom: 12,
  },
  itemDetails: { flex: 1, paddingRight: 16 },
  itemName: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
    marginBottom: 4,
  },
  itemQty: { fontSize: 12, color: "#666" },
  itemSubtotal: { fontSize: 14, fontWeight: "bold", color: "#1A1A1A" },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  addressText: { fontSize: 12, color: "#666" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: "#666" },
  summaryValue: { fontSize: 14, color: "#1A1A1A" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#E31837" },
  footer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E31837",
    alignItems: "center",
  },
  cancelButtonText: { color: "#E31837", fontSize: 16, fontWeight: "bold" },
});
