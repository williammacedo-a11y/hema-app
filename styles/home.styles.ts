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
  // --- BANNER PROMOCIONAL ---
  promoBanner: {
    backgroundColor: "#E31837", // Vermelho da marca
    margin: 16,
    padding: 24,
    borderRadius: 16, // De 4 para 16 (muito mais amigável)
    justifyContent: "center",
    // Adicionado um sombreado sutil para destacar o banner
    elevation: 4,
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  promoTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  promoSubtitle: {
    color: "#FFF",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24, // De 2 para 24 (formato de pílula)
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: "#E31837",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
  },
  // --- SEARCH BAR ---
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 24, // De 12 para 24 (formato de pílula arredondada)
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#EAEAEA", // Borda um pouco mais suave
  },
  // --- CABEÇALHOS DE SEÇÃO ---
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  // --- CATEGORIAS ---
  categoriesContainer: {
    paddingLeft: 16,
    paddingBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  // --- GRID DE PRODUTOS ---
  productGridContainer: {
    paddingHorizontal: 8,
  },
  productGridRow: {
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#FFF",
    width: width / 2 - 24,
    margin: 8,
    borderRadius: 16, // De 2 para 16
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 3, // Sombra um pouco mais presente no Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, // Sombra mais suave e espalhada no iOS
    shadowRadius: 8,
  },
  productImagePlaceholder: {
    height: 130,
    backgroundColor: "#FBFBFB",
    borderTopLeftRadius: 16, // Acompanha a curvatura do card para não vazar
    borderTopRightRadius: 16, // Acompanha a curvatura do card
  },
  productInfo: {
    padding: 12, // Um pouco mais de respiro interno
  },
  productName: {
    fontSize: 14,
    color: "#222",
    height: 38,
    marginBottom: 4,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#E31837",
    paddingVertical: 10, // Aumentei um pouco para facilitar o clique
    borderRadius: 100, // De 2 para 12 (botão bem amigável, sem ser pílula inteira)
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  // --- OFERTAS ---
  offersContainer: {
    paddingLeft: 16,
    paddingBottom: 30,
  },
  offerCard: {
    width: 150,
    marginRight: 16,
  },
  offerImagePlaceholder: {
    width: 150,
    height: 110,
    backgroundColor: "#F5F5F5",
    borderRadius: 12, // De 2 para 12
    marginBottom: 10, // Mais respiro antes do texto
  },
  offerName: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },
  oldPriceText: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  promoPriceText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E31837",
  },
});
