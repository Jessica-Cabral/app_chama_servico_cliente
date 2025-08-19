
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores2';
import Botao from '../componentes/Botao';

const TelaInicial = ({ navigation }) => {
  return (
    <LinearGradient colors={CORES.FUNDO_GRADIENTE} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.cabecalho}>
          <View style={styles.logoContainer}>
            <Ionicons name="construct" size={32} color={CORES.BRANCA} />
            <Text style={styles.logoTexto}>Chama Serviço</Text>
          </View>
        </View>

        <View style={styles.conteudo}>
          <View style={styles.containerPrincipal}>
            <Text style={styles.titulo}>
              Conectamos você aos melhores prestadores de serviços
            </Text>
            <Text style={styles.subtitulo}>
              Encontre profissionais qualificados para resolver suas necessidades 
              ou ofereça seus serviços de forma prática e segura
            </Text>
          </View>

          {/* <View style={styles.containerCaracteristicas}>
            <View style={styles.caracteristica}>
              <Ionicons name="person" size={24} color={CORES.BRANCA} />
              <Text style={styles.textoCaracteristica}>Clientes: Solicite servicos</Text>
            </View>
            <View style={styles.caracteristica}>
              <Ionicons name="construct" size={24} color={CORES.BRANCA} />
              <Text style={styles.textoCaracteristica}>Prestador: Ofereça seus serviços e gerencie atendimentos</Text>
            </View>
          </View> */}
        </View>

        <View style={styles.containerBotoes}>
          <Botao
            titulo="Entrar"
            aoPressionar={() => navigation.navigate('TelaLogin')}
            estilo={styles.botaoEntrar}
          />
          <Botao
            titulo="Criar Conta"
            estiloTexto={styles.botaoCriarConta}
            aoPressionar={() => navigation.navigate('TelaCadastro')}
            variante="outline"
            estilo={styles.botaoCriarConta}
          />
        </View>

        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>
            Já possui uma conta? 
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('TelaLogin')}>
            <Text style={styles.linkRodape}>Faça login aqui</Text>
          </TouchableOpacity>
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
  cabecalho: {
    padding: ESPACAMENTOS.GRANDE,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ESPACAMENTOS.EXTRA_GRANDE,
    gap: ESPACAMENTOS.PEQUENO,
  },
  logoTexto: {
    fontSize: TAMANHOS_FONTE.TITULO,
    fontWeight: "bold",
    color: CORES.BRANCA,
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ESPACAMENTOS.GRANDE,
  },
  containerPrincipal: {
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.EXTRA_GRANDE * 2,
  },
  titulo: {
    fontSize: TAMANHOS_FONTE.TITULO_GRANDE,
    fontWeight: "bold",
    color: CORES.BRANCA,
    textAlign: 'center',
    marginBottom: ESPACAMENTOS.GRANDE,
  },
  subtitulo: {
    fontSize: TAMANHOS_FONTE.GRANDE,
    color: CORES.BRANCA,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  containerCaracteristicas: {
    gap: ESPACAMENTOS.GRANDE,
  },
  caracteristica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTOS.MEDIO,
  },
  textoCaracteristica: {
    fontSize: TAMANHOS_FONTE.GRANDE,
    color: CORES.BRANCA,
    fontWeight: '500',
  },
  containerBotoes: {
    paddingHorizontal: ESPACAMENTOS.GRANDE,
    gap: ESPACAMENTOS.MEDIO,
  },
  botaoEntrar: {
    backgroundColor: CORES.PRIMARIA,
  },
  botaoCriarConta: {
    borderColor: CORES.BRANCA,
    color: CORES.BRANCA,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESPACAMENTOS.GRANDE,
    gap: ESPACAMENTOS.PEQUENO / 2,
  },
  textoRodape: {
    color: CORES.BRANCA,
    fontSize: TAMANHOS_FONTE.MEDIO,
    opacity: 0.8,
  },
  linkRodape: {
    color: CORES.BRANCA,
    fontSize: TAMANHOS_FONTE.MEDIO,
    fontWeight: "bold",
    textDecorationLine: 'underline',
  },
});

export default TelaInicial;
