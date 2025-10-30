import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../components/Botao";
import { SafeAreaProvider } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
  const abrirWeb = () => {
    Linking.openURL("https://chamaservico.tds104-senac.online/");
  };

  return (
    <LinearGradient colors={["#0a112e", "#283579"]} style={styles.container}>
      <View style={styles.containerBotaoEntrar}>
        <Botao
          title="Entrar"
          onPress={() => navigation.navigate("Login")}
          style={styles.botaoEntrar}
        />
      </View>
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
      <SafeAreaProvider style={styles.safeArea}>
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

          {/* <View style={styles.cartaoPerfil}>
            <View style={styles.iconeContainer}>
              <Ionicons name="star" size={48} color="#f5a522" />
            </View>
            <Text style={styles.tituloCartao}>Avaliações e Reputação</Text>
          </View> */}

          {/* Novo Card para acessar a versão web */}
          
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
    marginTop: 0,
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
  cabecalhoChama: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingTop:60,
    //marginBottom: 10,
    marginTop: 50,
  },
  logoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    marginVertical: 10,
    //marginTop: 10,
  },
  titulo: {
    fontSize: 24,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 16,
  },
  containerCartoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    rowGap: 16,
    marginVertical: 24,
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
    marginBottom: 10,
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
    marginBottom: 8,
  },
  containerBotaoEntrar: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    marginTop: 40,
  },
  botaoEntrar: {
    backgroundColor: "#f5a522",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  containerBotoes: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  botoes: {
    borderColor: "#FFF",
    color: "#FFF",
  },
});

export default HomeScreen;
