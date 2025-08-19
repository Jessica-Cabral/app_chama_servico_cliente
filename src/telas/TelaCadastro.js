import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores';
import Botao from '../componentes/Botao';
import CampoTexto from '../componentes/CampoTexto';

const TelaCadastro = ({ navigation }) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const manipularCadastro = () => {
    if (!nomeCompleto || !email || !telefone || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('Telainicial') }
    ]);
  };

  return (
    <LinearGradient colors={CORES.FUNDO_GRADIENTE} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Criar Conta</Text>
            <Text style={styles.subtitulo}>
              Preencha os dados para se cadastrar
            </Text>
          </View>

          <View style={styles.formulario}>
            <CampoTexto
              rotulo="Nome Completo"
              valor={nomeCompleto}
              aoMudar={setNomeCompleto}
              placeholder="Digite seu nome completo"
              obrigatorio
            />

            <CampoTexto
              rotulo="E-mail"
              valor={email}
              aoMudar={setEmail}
              placeholder="Digite seu e-mail"
              tipoTeclado="email-address"
              obrigatorio
            />

            <CampoTexto
              rotulo="Telefone"
              valor={telefone}
              aoMudar={setTelefone}
              placeholder="(00) 00000-0000"
              tipoTeclado="phone-pad"
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

            <CampoTexto
              rotulo="Confirmar Senha"
              valor={confirmarSenha}
              aoMudar={setConfirmarSenha}
              placeholder="Confirme sua senha"
              seguro
              obrigatorio
            />

            <Botao
              titulo="Cadastrar"
              aoPressionar={manipularCadastro}
              estilo={styles.botaoCadastro}
            />

            <Botao
              titulo="Já tenho conta"
              aoPressionar={() => navigation.navigate('TelaLogin')}
              variante="outline"
              estilo={styles.botaoLogin}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default TelaCadastro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: ESPACAMENTOS.GRANDE,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.EXTRA_GRANDE,
  },
  titulo: {
    fontSize: TAMANHOS_FONTE.TITULO_GRANDE,
    fontWeight: '18',
    color: CORES.PRIMARIA,
    marginBottom: ESPACAMENTOS.PEQUENO,
  },
  subtitulo: {
    fontSize: TAMANHOS_FONTE.GRANDE,
    color: CORES.BRANCA,
    textAlign: 'center',
    opacity: 0.9,
  },
  formulario: {
    backgroundColor: CORES.BRANCA,
    borderRadius: 12,
    padding: ESPACAMENTOS.GRANDE,
    shadowColor: CORES.CINZA,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botaoCadastro: {
    marginTop: ESPACAMENTOS.GRANDE,
    backgroundColor: CORES.PRIMARIA,
  },
  botaoLogin: {
    marginTop: ESPACAMENTOS.MEDIO,
    borderColor: CORES.PRIMARIA,
  },
});