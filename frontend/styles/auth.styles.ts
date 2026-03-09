import { StyleSheet, Platform } from "react-native";

export const PRIMARY_COLOR = "#EA1D2C";
export const BACKGROUND_COLOR = "#FFFFFF";
export const TEXT_MAIN = "#1A1A1A";
export const TEXT_SECONDARY = "#666666";
export const BORDER_COLOR = "#E8E8E8";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 28, // Um pouco mais de respiro nas laterais
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 42, // Ajustado para não "gritar" tanto
    fontWeight: "900",
    color: PRIMARY_COLOR,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginTop: 12,
    lineHeight: 24,
    fontWeight: "400",
  },
  form: {
    width: "100%",
  },
  // Novo estilo para a etiqueta acima do input
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 16, // Mais arredondado = mais moderno
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputWrapperFocused: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#FFFFFF",
    borderWidth: 2, // Borda levemente mais grossa no foco
  },
  input: {
    height: 60, // Um pouco mais alto para facilitar o toque
    paddingHorizontal: 20,
    fontSize: 16,
    color: TEXT_MAIN,
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    // Sombra do botão mais suave e difusa
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase", // Opcional, dá um ar mais forte
    letterSpacing: 0.5,
  },
  // Estilo para login social (Google/Apple)
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    gap: 16,
  },
  socialButton: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    width: 60,
    alignItems: "center",
  },
  secondaryButton: {
    marginTop: 24,
    alignItems: "center",
    alignSelf: "center",
  },
  secondaryText: {
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  secondaryTextBold: {
    fontWeight: "700",
    color: PRIMARY_COLOR,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: "500",
  },
});
