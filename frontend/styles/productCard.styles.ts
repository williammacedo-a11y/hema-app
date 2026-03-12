import { StyleSheet, Platform } from "react-native";

export const cardStyles = StyleSheet.create({
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 10, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 15,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  carouselWidth: {
    width: 155,
    marginRight: 16,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 4,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#F9F9F9",
  },
  productImage: {
    width: "100%",
  },
  imageFallback: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 10,
    paddingBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#E31837",
  },
  discreteAddButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    backgroundColor: "#E31837",
    borderRadius: 6,
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
