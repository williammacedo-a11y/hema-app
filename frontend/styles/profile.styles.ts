import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  // --- SEÇÃO DO USUÁRIO ---
  headerSection: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#CCC",
    fontWeight: "600",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  // --- LISTA DE OPÇÕES ---
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F8F8",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
  chevron: {
    fontSize: 18,
    color: "#BBB",
    fontWeight: "300",
  },
  // --- BOTÃO SAIR ---
  logoutContainer: {
    marginTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#E31837", // Vermelho principal
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  // --- Estilos Compartilhados ---
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  containerGray: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backBtn: { padding: 8 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
    padding: 20,
  },

  // --- PersonalDetails (Meus Dados) ---
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#1A1A1A",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  saveBtn: {
    backgroundColor: "#E31837",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // --- Settings (Configurações) ---
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  rowText: { fontSize: 16, color: "#333" },
  version: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },

  // --- Support (Ajuda e Suporte) ---
  aiBox: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  aiText: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  aiButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  aiButtonText: { color: "#999", fontWeight: "bold" },
  dividerText: {
    textAlign: "center",
    color: "#999",
    fontWeight: "bold",
    fontSize: 12,
    marginVertical: 30,
  },
  wppButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#25D366",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  wppTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  wppSubtitle: { color: "#E0F7E9", fontSize: 12, marginTop: 4 },
});
