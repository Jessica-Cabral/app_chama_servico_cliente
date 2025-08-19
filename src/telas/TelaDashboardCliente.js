import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores';
import Botao from '../componentes/Botao';

const solicitacoesMock = [
  {
    id: '1',
    titulo: 'Conserto de torneira',
    status: 'Em andamento',
    data: '19/08/2025',
  },
  {
    id: '2',
    titulo: 'Instalação de chuveiro',
    status: 'Finalizado',
    data: '18/08/2025',
  },
];

const TelaDashboardCliente = ({ navigation }) => {
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesMock);

  const renderSolicitacao = ({ item }) => (
    <View style={styles.cardSolicitacao}>
      <View style={styles.cardHeader}>
        <Ionicons
          name={item.status === 'Finalizado' ? 'checkmark-circle' : 'time'}
          size={24}
          color={item.status === 'Finalizado' ? CORES.PRIMARIA : CORES.SECUNDARIA}
        />
        <Text style={styles.cardTitulo}>{item.titulo}</Text>
      </View>
      <Text style={styles.cardStatus}>
        Status: <Text style={{ color: item.status === 'Finalizado' ? CORES.PRIMARIA : CORES.SECUNDARIA }}>{item.status}</Text>
      </Text>
      <Text style={styles.cardData}>Data: {item.data}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas Solicitações</Text>
          <Botao
            titulo="Nova Solicitação"
            aoPressionar={() => navigation.navigate('TelaNovaSolicitacao')}
            estilo={styles.botaoNova}
          />
        </View>
        <FlatList
          data={solicitacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderSolicitacao}
          contentContainerStyle={styles.listaSolicitacoes}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.PRETA,
  },
  scrollContainer: {
    padding: ESPACAMENTOS.GRANDE,
  },
  header: {
    marginBottom: ESPACAMENTOS.GRANDE,
    alignItems: 'center',
  },
  titulo: {
    fontSize: TAMANHOS_FONTE.TITULO_GRANDE,
    fontWeight: 'bold',
    color: CORES.PRIMARIA,
    marginBottom: ESPACAMENTOS.MEDIO,
  },
  botaoNova: {
    backgroundColor: CORES.PRIMARIA,
    marginBottom: ESPACAMENTOS.GRANDE,
  },
  listaSolicitacoes: {
    gap: ESPACAMENTOS.MEDIO,
  },
  cardSolicitacao: {
    backgroundColor: CORES.BRANCA,
    borderRadius: 12,
    padding: ESPACAMENTOS.GRANDE,
    shadowColor: CORES.CINZA,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: ESPACAMENTOS.MEDIO,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.PEQUENO,
    gap: ESPACAMENTOS.PEQUENO,
  },
  cardTitulo: {
    fontSize: TAMANHOS_FONTE.GRANDE,
    fontWeight: '18',
    color: CORES.SECUNDARIA,
    marginLeft: ESPACAMENTOS.PEQUENO,
  },
  cardStatus: {
    fontSize: TAMANHOS_FONTE.MEDIO,
    color: CORES.CINZA,
    marginBottom: ESPACAMENTOS.PEQUENO,
  },
  cardData: {
    fontSize: TAMANHOS_FONTE.PEQUENO,
    color: CORES.CINZA,
  },
});

export default TelaDashboardCliente