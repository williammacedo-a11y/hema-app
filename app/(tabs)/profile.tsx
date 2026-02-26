import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

// Importação dos estilos separados
import { styles } from "../../styles/profile.styles";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock de dados do usuário e opções
const USER_DATA = {
  name: "Rodrigo Silva",
  email: "rodrigo.silva@email.com",
};

const MENU_OPTIONS = [
  { id: "1", title: "Meus Pedidos" },
  { id: "2", title: "Endereço de Entrega" },
  { id: "3", title: "Formas de Pagamento" },
  { id: "4", title: "Meus Dados" },
  { id: "5", title: "Configurações" },
  { id: "6", title: "Ajuda e Suporte" },
];

export default function ProfileScreen() {
  const handleLogout = () => {
    console.log("Usuário saiu");
    // Aqui viria a lógica de autenticação
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção Superior: Avatar e Infos */}
          <View style={styles.headerSection}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>RS</Text>
            </View>
            <Text style={styles.userName}>{USER_DATA.name}</Text>
            <Text style={styles.userEmail}>{USER_DATA.email}</Text>
          </View>

          {/* Seção de Menu */}
          <View style={styles.menuSection}>
            {MENU_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.6}
              >
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botão Sair */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
