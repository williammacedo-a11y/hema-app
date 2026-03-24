import { StyleSheet, Platform } from "react-native";

export const cardStyles = StyleSheet.create({
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12, // Um pouco mais arredondado fica mais moderno
    overflow: "hidden",
    flex: 1,
    // A borda sutil é o segredo para o card não "sumir" se o fundo do app for muito claro
    borderWidth: 1,
    borderColor: "#EAEAEA",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 }, // Aumentei um pouco a altura da sombra
        shadowOpacity: 0.06, // Sombra mais transparente e elegante
        shadowRadius: 8,
      },
      android: {
        elevation: 2, // Reduzi um pouco para não ficar grosseiro com a borda
      },
    }),
  },
  carouselWidth: {
    width: 220,
    marginBottom: 0,
  },
  imageContainer: {
    width: "100%",
    height: 130,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1, // Uma linha sutil separando a foto das informações
    borderBottomColor: "#F0F0F0",
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  productInfo: {
    padding: 12, // Um respiro maior nas laterais
    paddingBottom: 8,
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222222", // Um preto um pouquinho mais suave que o 1A1A1A
    lineHeight: 18,
    marginBottom: 6,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 16, // Destaque maior para o preço
    fontWeight: "800",
    color: "#E31837",
    marginBottom: 10,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
  },
  discreteAddButton: {
    paddingVertical: 10, // Botão um pouco mais gordinho = melhor área de clique
    paddingHorizontal: 10,
    marginBottom: 4,
    backgroundColor: "#E31837",
    borderRadius: 8, // Mais quadrado com bordas arredondadas (combina melhor com card de produto)
    alignItems: "center",
    justifyContent: "center",
  },
  discreteAddButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "uppercase",
  },
});
