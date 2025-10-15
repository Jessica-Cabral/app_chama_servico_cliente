//Formulario de cadastro
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { cadastrarCliente } from "../services/cadastro";
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


const CadastroCliente = ({ navigation }) => {
  //acessar token
  const {token} = useContext(AuthContext)
  //parâmentos utilizados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar_senha, setConfirmar_senha] = useState("");

  const manipularCadastro = async () => {
    console.log("Botão pressionado");
    //valida se todos os campos obrigatórios foram preenchidos
    if (!nome || !email || !senha || !confirmar_senha) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }
    //verifica se as senhas são iguais.
    if (senha !== confirmar_senha) {
      Alert.alert("Erro", "As senhas não coincidem. Digite a senha novamente.");
      return;
    }
    
    const resultado = await cadastrarCliente(nome, email, senha, novaSenha, token);

    if (resultado.sucesso) {
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.replace("Login");
    } else {
      Alert.alert("Erro", resultado.erro || "Erro ao cadastrar.");
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
              <Text style={styles.titulo}>Crie sua conta</Text>
              <Text style={styles.subtitulo}>
                Preencha os dados para se cadastrar
              </Text>

              <InputCampo
                label="Nome Completo"
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome completo"
                icone={<Ionicons name="person-outline" size={20} color="#283579" />}
              />
              <Text>Informe seu nome como aparece em documentos.</Text>

              <InputCampo
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                secureTextEntry={false}
                icone={<Ionicons name="mail-outline" size={20} color="#283579" />}
              />

              <InputCampo
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                placeholder="Crie uma senha"
                secureTextEntry={true}
                obrigatorio
                icone={<Ionicons name="lock-closed-outline" size={20} color="#283579" />}
              />

              <InputCampo
                label="Confirmar Senha"
                value={confirmar_senha}
                onChangeText={setConfirmar_senha}
                placeholder="Confirme a senha"
                secureTextEntry={true}
                icone={<Ionicons name="lock-closed-outline" size={20} color="#283579" />}
              />

              <Botao
                title="Cadastrar"
                onPress={manipularCadastro}
                style={styles.botaoLogin}
                styleTexto={styles.textoBotao}
              />

              <View style={styles.containerCadastro}>
                <Text style={styles.textoCadastro}>Já tem uma conta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.linkCadastro}>Entrar</Text>
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
  // reutiliza os mesmos estilos da tela de login
  container: { flex: 1 },
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  cabecalho: { alignItems: "center", justifyContent: "center", padding: 24, paddingTop: 50 },
  logoLinha: { flexDirection: "row", alignItems: "center", gap: 8 },
  textoLogo: { fontSize: 32, color: "#FFF", fontWeight: "bold" },
  textoLogoServico: { fontSize: 32, color: "#f5a522", fontWeight: "bold", marginLeft: 8 },
  containerFormulario: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  titulo: { fontSize: 24, color: "#0a112e", fontWeight: 'bold', textAlign: "center", marginBottom: 8 },
  subtitulo: { fontSize: 16, color: '#4e5264', textAlign: "center", opacity: 0.9, marginBottom: 32 },
  formulario: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#0a112e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botaoLogin: { marginBottom: 24 },
  containerCadastro: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  textoCadastro: { color: "#4e5264", fontSize: 14 },
  linkCadastro: { color: "#f5a522", fontSize: 14 },
});

export default CadastroCliente;