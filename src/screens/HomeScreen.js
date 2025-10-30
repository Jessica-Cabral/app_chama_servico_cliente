import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../components/Botao";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: screenHeight } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const abrirWeb = () => {
    Linking.openURL("https://chamaservico.tds104-senac.online/");
  };

  return (
    <LinearGradient colors={["#0a112e", "#283579"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Conteúdo Principal com Scroll */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho */}
          <View style={styles.cabecalhoChama}>
            <View style={styles.logoLinha}>
              <Text style={styles.textoLogo}>CHAMA</Text>
              <Text style={styles.textoLogoServico}>SERVIÇO</Text>
            </View>
            <View style={styles.containerPrincipal}>
              <Text style={styles.titulo}>
                Conectamos você aos melhores prestadores de serviços
              </Text>
            </View>
          </View>

          {/* Cards de Serviços */}
          <View style={styles.containerCartoes}>
            <TouchableOpacity style={styles.cartaoPerfil} onPress={abrirWeb}>
              <View style={styles.iconeContainer}>
                <Ionicons name="globe-outline" size={48} color="#f5a522" />
              </View>
              <Text style={styles.tituloCartao}>
                Acesse a versão web para mais detalhes
              </Text>
            </TouchableOpacity>
            
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
          </View>
        </ScrollView>

        {/* Container Fixo para os Botões na Parte Inferior */}
        <View style={styles.containerBotoes}>
          <Botao
            title="Entrar"
            onPress={() => navigation.navigate("Login")}
            style={styles.botaoEntrar}
            styleTexto={styles.textoBotaoEntrar}
          />
          <Botao
            title="Quero me cadastrar"
            onPress={() => navigation.navigate("CadastroCliente")}
            style={styles.botaoCadastrar}
            styleTexto={styles.textoBotaoCadastrar}
          />
        </View>
      </SafeAreaView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 140, // Espaço extra para os botões
  },
  cabecalhoChama: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: screenHeight * 0.12, // 12% da altura da tela
    paddingBottom: screenHeight * 0.05, // 5% da altura da tela
  },
  logoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  textoLogo: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "bold",
  },
  textoLogoServico: {
    fontSize: 32,
    color: "#f5a522",
    fontWeight: "bold",
    marginLeft: 8,
  },
  containerPrincipal: {
    alignItems: "center",
  },
  titulo: {
    fontSize: 22,
    color: "#FFF",
    textAlign: "center",
    lineHeight: 28,
  },
  containerCartoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    rowGap: 16,
    marginBottom: 20,
  },
  cartaoPerfil: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "47%",
    height: screenHeight * 0.22, // 22% da altura da tela
    minHeight: 160, // Altura mínima para telas muito pequenas
    shadowColor: "#0a112e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
  },
  iconeContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  tituloCartao: {
    fontSize: 14,
    color: "#283579",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 18,
  },
  containerBotoes: {
    paddingHorizontal: 20,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  botaoEntrar: {
    backgroundColor: "#f5a522",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  textoBotaoEntrar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoCadastrar: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFF",
    paddingVertical: 14,
    borderRadius: 10,
  },
  textoBotaoCadastrar: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;