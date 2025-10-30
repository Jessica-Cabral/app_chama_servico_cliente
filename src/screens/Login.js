import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { autenticarCliente } from "../services/auth";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../components/Botao";
import InputCampo from "../components/InputCampo";

const Login = ({ navigation }) => {
  //acessa o login do contexto
  const { login } = useContext(AuthContext);
  // parâmentros
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const manipularLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    const resultado = await autenticarCliente(email, senha);

    if (resultado.sucesso) {
      // salva  no contexto e inclui token
      await login({ ...resultado.usuario, token: resultado.token });
      navigation.replace("MainTabs");
    } else {
      Alert.alert("Erro", resultado.erro || "Erro ao realizar login.");
    }
  };

  return (
    <LinearGradient colors={["#0a112e", "#283579"]} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cabecalho}>
            <View style={styles.logoLinha}>
              <Text style={styles.textoLogo}>CHAMA</Text>
              <Text style={styles.textoLogoServico}>SERVIÇO</Text>
            </View>
          </View>

          <View style={styles.containerFormulario}>
            <View style={styles.formulario}>
              <View>
                <Text style={styles.titulo}>Bem-vindo!</Text>
                <Text style={styles.subtitulo}>
                  Acesse sua conta para usar o sistema
                </Text>
              </View>

              <InputCampo
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                secureTextEntry={false}
                icone={
                  <Ionicons name="mail-outline" size={20} color="#283579" />
                }
              />

              <InputCampo
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                secureTextEntry={true}
                icone={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#283579"
                  />
                }
              />

              <TouchableOpacity
                style={styles.linkEsqueceuSenha}
                onPress={() => navigation.navigate("")}
              >
                <Text style={styles.textoEsqueceuSenha}>
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>

              <Botao
                title="Entrar"
                onPress={manipularLogin}
                style={styles.botaoLogin}
                styleTexto={styles.textoBotao}
              />

              <View style={styles.containerCadastro}>
                <Text style={styles.textoCadastro}>Não tem uma conta?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("CadastroCliente")}
                >
                  <Text style={styles.linkCadastro}>Cadastre-se aqui</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containerVoltar}>
                <TouchableOpacity
                  style={styles.botaoVoltar}
                  onPress={() => navigation.navigate("HomeScreen")}
                >
                  <Ionicons name="arrow-back" size={16} color="#f5a522" />
                  <Text style={styles.textoVoltar}>Voltar para a Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  cabecalho: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingTop: 120,
    marginBottom: 32,
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
  containerFormulario: {
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 24,
    color: "#0a112e",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#4e5264",
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 32,
  },
  formulario: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#0a112e",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linkEsqueceuSenha: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  textoEsqueceuSenha: {
    color: "#f5a522",
    fontSize: 12,
  },
  botaoLogin: {
    marginBottom: 24,
    color: "#fff",
  },
  containerCadastro: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  textoCadastro: {
    color: "#4e5264",
    fontSize: 14,
  },
  linkCadastro: {
    color: "#f5a522",
    fontSize: 14,
  },
  containerVoltar: {
      marginTop: 16,
      alignItems: 'center',
    },
    botaoVoltar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    textoVoltar: {
      color: "#283579",
      fontSize: 14,
      fontWeight: '500',
    },
});

export default Login;
