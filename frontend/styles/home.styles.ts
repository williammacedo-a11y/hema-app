import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E31837",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // --- HEADER & SEARCH BAR ---
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 15,
    backgroundColor: "#E31837",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    height: "100%",
  },
  iconButton: {
    padding: 4,
  },
  // --- SEÇÕES E CARROSSÉIS ---
  sectionContainer: {
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 16,
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 10,
  },
  horizontalListContent: {
    paddingRight: 8,
    paddingLeft: 18,
  },
  // --- GRADE DE RESULTADOS ---
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 18,
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    color: "#999",
    fontSize: 15,
  },
  loadMoreButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 100, // Deixa ele arredondado, estilo iFood
    borderWidth: 1,
    borderColor: "#E31837", // Borda vermelha para destaque
    marginTop: 10,
    marginBottom: 20,
  },
  loadMoreText: {
    color: "#E31837",
    fontWeight: "bold",
    fontSize: 14,
  },
  // --- SKELETONS ---
  skeletonRow: {
    flexDirection: "row",
    paddingLeft: 18,
    gap: 12,
    marginBottom: 24,
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 20,
  },
  skeletonGridItem: {
    width: "48%",
    marginBottom: 16,
  },
});
