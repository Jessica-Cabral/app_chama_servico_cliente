
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
import Botao from '../components/Botao';
import Input from '../components/Input';


const Login = ({ navigation }) => {
  console.log('Iniciando renderização do App');
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
    <LinearGradient colors={['#0a112e', '#283579']} style={styles.container}>
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
              <Ionicons name="arrow-back" size={24} color='#FFF' />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Ionicons name="construct" size={32} color='#FFF' />
              <Text style={styles.logoTexto}>Chama Serviços</Text>
            </View>
          </View>

          <View style={styles.containerFormulario}>
            <Text style={styles.titulo}>Fazer Login</Text>
            <Text style={styles.subtitulo}>
              Entre com seus dados para acessar sua conta
            </Text>

            <View style={styles.formulario}>
              <Input
                rotulo="E-mail"
                valor={email}
                aoMudar={setEmail}
                placeholder="Digite seu e-mail"
                tipoTeclado="email-address"
                obrigatorio
              />

              <Input
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
    padding: 24,
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
    gap: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 40,
  },
  logoTexto: {
    fontSize: 24,

    color: '#FFF',
  },
  containerFormulario: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 32,

    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 32,
  },
  formulario: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#0a112e',
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
    marginBottom: 24,
  },
  textoEsqueceuSenha: {
    color: '#f5a522',
    fontSize: 12,
  },
  botaoLogin: {
    marginBottom: 24,
  },
  containerCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8 / 2,
  },
  textoCadastro: {
    color:'#4e5264',
    fontSize: 14,
  },
  linkCadastro: {
    color: '#f5a522',
    fontSize: 14,

  },
});

export default Login;
