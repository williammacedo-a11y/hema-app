import { StyleSheet, Platform } from "react-native";

export const cardStyles = StyleSheet.create({
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  carouselWidth: {
    width: 155,
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
    height: 130,
    backgroundColor: "#F9F9F9",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  productInfo: {
    padding: 10,
    paddingBottom: 4,
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
    marginBottom: 4,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#E31837",
    marginBottom: 8,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
  },
  discreteAddButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    backgroundColor: "#E31837",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  discreteAddButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "uppercase",
  },
});
