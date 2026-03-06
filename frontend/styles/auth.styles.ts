import { StyleSheet } from "react-native";
export const PRIMARY_COLOR = "#EA1D2C";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 48,
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 48,
    fontWeight: "900",
    color: PRIMARY_COLOR,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 8,
    lineHeight: 22,
    maxWidth: "80%",
  },
  form: {
    width: "100%",
  },
  inputWrapper: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1.5,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    // Sombra sutil padrão
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#FFFFFF",
    // Sombra acentuada no foco
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333333",
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 32,
    alignItems: "center",
    padding: 10,
  },
  secondaryText: {
    fontSize: 15,
    color: "#666666",
  },
  secondaryTextBold: {
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});
