import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#888",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  filterIconButton: {
    borderWidth: 1,
    borderColor: "#E31837",
    height: 45,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    color: "#E31837",
    fontSize: 12,
    fontWeight: "700",
  },
  // --- BUSCAS FREQUENTES ---
  frequentScroll: {
    paddingLeft: 16,
    marginBottom: 16,
    maxHeight: 40,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // Badges mais redondinhos para diferenciar de botões
    marginRight: 8,
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    height: 35,
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  // --- GRID DE RESULTADOS ---
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#FFF",
    width: width / 2 - 16,
    margin: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  placeholderText: {
    color: "#CCC",
    fontSize: 12,
    marginTop: 4,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    color: "#333",
    height: 36,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#E31837",
    paddingVertical: 6,
    borderRadius: 2,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 14,
  },
  // --- MODAL DE FILTRO ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  sortOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sortOptionActive: {
    backgroundColor: "#FFF5F5", // Fundo levemente vermelho se ativo
  },
  sortOptionText: {
    fontSize: 16,
    color: "#333",
  },
  sortOptionTextActive: {
    color: "#E31837",
    fontWeight: "700",
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#F2F2F2",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  closeModalText: {
    fontWeight: "600",
    color: "#333",
  },
});
