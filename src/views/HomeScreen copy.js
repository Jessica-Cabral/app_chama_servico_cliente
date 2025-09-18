

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
        <View style={styles.cabecalho}>
          <View style={styles.logoContainer}>
            <Ionicons name="construct" size={32} color="#FFF" />
            <Text style={styles.logoTexto}>Chama Serviço</Text>
          </View>
        </View>

        <View style={styles.conteudo}>
          <View style={styles.containerPrincipal}>
            <Text style={styles.titulo}>
              Conectamos você aos melhores prestadores de serviços
            </Text>
            <Text style={styles.subtitulo}>
              Encontre profissionais qualificados para resolver suas
              necessidades ou ofereça seus serviços de forma prática e segura
            </Text>
          </View>

          <View style={styles.containerCaracteristicas}>
            <View style={styles.caracteristica}>
              <Ionicons name="person" size={24} color='#FFF' />
              <Text style={styles.textoCaracteristica}>
                Clientes: Solicite servicos
              </Text>
            </View>
      
          </View>
        </View>

<View style={styles.containerCartoes}>
            <View
              style={styles.cartaoPerfil}
              onPress={() => selecionarPerfil('cliente')}
            >
              <View style={styles.iconeContainer}>
                <Ionicons name="person" size={48} color='#f5a522' />
              </View>
              <Text style={styles.tituloCartao}>Cliente</Text>
              <View style={styles.caracteristica}>
              <Ionicons name="person" size={24} color='#FFF' />
              <Text style={styles.textoCaracteristica}>
                Clientes: Solicite servicos
              </Text>
            </View>
              <Text style={styles.descricaoCartao}>
                Solicite serviços e acompanhe suas demandas
              </Text>
              <View style={styles.setaContainer}>
                <Ionicons name="arrow-forward" size={20} color='#f5a522' />
              </View>
            </View>

            <TouchableOpacity
              style={styles.cartaoPerfil}
              onPress={() => selecionarPerfil('prestador')}
            >
              <View style={styles.iconeContainer}>
                <Ionicons name="construct" size={48} color='#283579' />
              </View>
              <Text style={styles.tituloCartao}>Prestador</Text>
              <Text style={styles.descricaoCartao}>
                Ofereça seus serviços e gerencie atendimentos
              </Text>
              <View style={styles.setaContainer}>
                <Ionicons name="arrow-forward" size={20} color='#283579' />
              </View>
            </TouchableOpacity>
          </View>

        <View style={styles.containerBotoes}>
          <Botao
            title="Entrar"
            onPress={() => navigation.navigate("TelaLogin")}
            style={styles.botaoEntrar}
          />
          <Botao
            title="Criar Conta"
            style={styles.botaoCriarConta}
            onPress={() => navigation.navigate("TelaCadastro")}
            variante="outline"
            styleTexto={styles.botaoCriarConta}
          />
        </View>

        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TelaLogin")}>
            <Text style={styles.linkRodape}>Faça login aqui</Text>
          </TouchableOpacity>
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
    marginBottom: 32 * 2,
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
    color: "#FFF",
  },
  containerBotoes: {
    paddingHorizontal: 24,
    gap: 16,
  },
  botaoEntrar: {
    backgroundColor: "#f5a522",
  },
  botaoCriarConta: {
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
    gap: 24,
  },
  cartaoPerfil: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#0a112e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  tituloCartao: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e5264',
    marginBottom: 8,
  },
  descricaoCartao: {
    fontSize: 16,
    color: '#4e5264',
    textAlign: 'center',
    marginBottom: 24,
  },
  setaContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
