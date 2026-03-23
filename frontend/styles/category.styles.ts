import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Fundo "off-white" ajuda os cards brancos a ganharem destaque
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16, // Um leve arredondamento dá um ar moderno
    borderBottomRightRadius: 16,
    // Sombra suave para separar o header do conteúdo
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
    zIndex: 10, // Garante que a sombra fique sobre a lista
  },
  backButton: {
    padding: 8,
    backgroundColor: "#F0F0F0", // Um círculo sutil atrás do ícone de voltar
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 12,
    textTransform: "capitalize",
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardWrapper: {
    width: "48%", // metade da tela com margem
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 24,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16, // Mesmo padding horizontal da sua lista real
    paddingTop: 16, // Um respiro no topo para não colar no header
  },
  skeletonGridItem: {
    width: "48%", // Força 2 colunas
    marginBottom: 16, // Espaço vertical entre as linhas de skeletons
  },
});
