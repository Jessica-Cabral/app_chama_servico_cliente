
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores2';
import Botao from '../componentes/Botao';
import CampoTexto from '../componentes/CampoTexto';

const TelaLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const manipularLogin = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    onPress: () => navigation.navigate('TelaInicial') 
    // Alert.alert('Sucesso', 'Login realizado com sucesso!', [
    //   { text: 'OK', onPress: () => navigation.navigate('TelaSelecionarPerfil') }
    // ]);
  };

  return (
    <LinearGradient colors={CORES.FUNDO_GRADIENTE} style={styles.container}>
      <KeyboardAvoidingView
        //behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cabecalho}>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={CORES.BRANCA} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Ionicons name="construct" size={32} color={CORES.BRANCA} />
              <Text style={styles.logoTexto}>Chama Serviços</Text>
            </View>
          </View>

          <View style={styles.containerFormulario}>
            <Text style={styles.titulo}>Fazer Login</Text>
            <Text style={styles.subtitulo}>
              Entre com seus dados para acessar sua conta
            </Text>

            <View style={styles.formulario}>
              <CampoTexto
                rotulo="E-mail"
                valor={email}
                aoMudar={setEmail}
                placeholder="Digite seu e-mail"
                tipoTeclado="email-address"
                obrigatorio
              />

              <CampoTexto
                rotulo="Senha"
                valor={senha}
                aoMudar={setSenha}
                placeholder="Digite sua senha"
                seguro
                obrigatorio
              />

              <TouchableOpacity style={styles.linkEsqueceuSenha}>
                <Text style={styles.textoEsqueceuSenha}>
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>

              <Botao
                titulo="Entrar"
                //aoPressionar={manipularLogin}
                aoPressionar= {() => navigation.navigate('TelaInicial')}
                style={styles.botaoLogin}
              />

              <View style={styles.containerCadastro}>
                <Text style={styles.textoCadastro}>
                  Não tem uma conta? 
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('TelaCadastro')}>
                  <Text style={styles.linkCadastro}>Cadastre-se aqui</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ESPACAMENTOS.GRANDE,
    paddingTop: 50,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTOS.PEQUENO,
    flex: 1,
    justifyContent: 'center',
    marginRight: 40,
  },
  logoTexto: {
    fontSize: TAMANHOS_FONTE.TITULO,
    fontWeight: "bold",
    color: CORES.BRANCA,
  },
  containerFormulario: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ESPACAMENTOS.GRANDE,
  },
  titulo: {
    fontSize: TAMANHOS_FONTE.TITULO_GRANDE,
    fontWeight: "bold",
    color: CORES.BRANCA,
    textAlign: 'center',
    marginBottom: ESPACAMENTOS.PEQUENO,
  },
  subtitulo: {
    fontSize: TAMANHOS_FONTE.GRANDE,
    color: CORES.BRANCA,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: ESPACAMENTOS.EXTRA_GRANDE,
  },
  formulario: {
    backgroundColor: CORES.BRANCA,
    borderRadius: 12,
    padding: ESPACAMENTOS.GRANDE,
    shadowColor: CORES.PRETA,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linkEsqueceuSenha: {
    alignSelf: 'flex-end',
    marginBottom: ESPACAMENTOS.GRANDE,
  },
  textoEsqueceuSenha: {
    color: CORES.PRIMARIA,
    fontSize: TAMANHOS_FONTE.PEQUENO,
  },
  botaoLogin: {
    marginBottom: ESPACAMENTOS.GRANDE,
  },
  containerCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ESPACAMENTOS.PEQUENO / 2,
  },
  textoCadastro: {
    color: CORES.CINZA,
    fontSize: TAMANHOS_FONTE.MEDIO,
  },
  linkCadastro: {
    color: CORES.PRIMARIA,
    fontSize: TAMANHOS_FONTE.MEDIO,
    fontWeight: "bold",
  },
});

export default TelaLogin;
