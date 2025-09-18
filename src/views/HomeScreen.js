import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../components/Botao";
import { SafeAreaProvider } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={["#0a112e", "#283579"]} style={styles.container}>
      <SafeAreaProvider style={styles.safeArea}>
        <View style={styles.containerBotaoEntrar}>
          <Botao
            title="Entrar"
            onPress={() => navigation.navigate("TelaLogin")}
            style={styles.botaoEntrar}
          />
        </View>


        <View style={styles.containerPrincipal}>
          <Text style={styles.titulo}>
            Conectamos você aos melhores prestadores de serviços
          </Text>
        </View>

        <View style={styles.containerCartoes}>
          <View style={styles.cartaoPerfil}>
            <View style={styles.iconeContainer}>
              <Ionicons name="search" size={48} color="#f5a522" />
            </View>
            <Text style={styles.tituloCartao}>Encontre profissionais</Text>
          </View>

          <View style={styles.cartaoPerfil}>
            <View style={styles.iconeContainer}>
              <Ionicons name="construct" size={48} color="#f5a522" />
            </View>
            <Text style={styles.tituloCartao}>Solicite Serviços</Text>
          </View>

          <View style={styles.cartaoPerfil}>
            <View style={styles.iconeContainer}>
              <Ionicons name="list-circle" size={48} color="#f5a522" />
            </View>
            <Text style={styles.tituloCartao}>Gerencie Suas Solicitações</Text>
          </View>
          <View style={styles.cartaoPerfil}>
            <View style={styles.iconeContainer}>
              <Ionicons name="star" size={48} color="#f5a522" />
            </View>
            <Text style={styles.tituloCartao}>Avaliações e Reputação</Text>
          </View>
        </View>

        <View style={styles.containerBotoes}>
          <Botao
            title="Quero me cadastrar"
            onPress={() => navigation.navigate("CadastroCliente")}
            style={styles.botoes}
          />
        </View>
      </SafeAreaProvider>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  cabecalho: {
    padding: 16,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 32,
    gap: 8,
  },
  logoTexto: {
    fontSize: 24,

    color: "#FFF",
  },
  conteudo: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  containerPrincipal: {
    alignItems: "center",
    marginVertical: 10, // espaçamento acima e abaixo
    marginTop:80,
  },
  titulo: {
    fontSize: 32,

    color: "#FFF",
    textAlign: "center",
    marginBottom: 24,
  },
  subtitulo: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
  },
  containerCaracteristicas: {
    gap: 24,
  },
  caracteristica: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  textoCaracteristica: {
    fontSize: 16,
    color: "#283579",
  },
  containerBotoes: {
    paddingHorizontal: 24,
    paddingVertical: 32, // espaçamento interno acima e abaixo
    gap: 16,
  },
  containerBotaoEntrar: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  botaoEntrar: {
    backgroundColor: "#f5a522",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botoes: {
    borderColor: "#FFF",
    color: "#FFF",
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 8 / 2,
  },
  textoRodape: {
    color: "#FFF",
    fontSize: 14,
    opacity: 0.8,
  },
  linkRodape: {
    color: "#FFF",
    fontSize: 14,

    textDecorationLine: "none",
  },
  containerCartoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    rowGap: 20,
    marginVertical: 32, // espaçamento acima e abaixo
  },
  cartaoPerfil: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "47%",
    height: 180,
    shadowColor: "#0a112e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  tituloCartao: {
    fontSize: 16,
    color: "#283579",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
});

export default HomeScreen;
