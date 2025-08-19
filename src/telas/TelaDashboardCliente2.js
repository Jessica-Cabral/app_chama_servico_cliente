
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
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores2';
import Botao from '../componentes/Botao';

const TelaDashboardCliente = ({ navigation }) => {
  const [solicitacoes] = useState([
    {
      id: 1,
      titulo: 'Instalação de tomada',
      categoria: 'Elétrica',
      endereco: 'Rua 4, 123 - Taguatinga',
      data: '14/02/2025',
      valor: 'R$ 150,00',
      status: 'pendente',
      prestador: null
    },
    {
      id: 2,
      titulo: 'Reparo de vazamento',
      categoria: 'Encanamento',
      endereco: 'QNG, 456 - Taguatinga',
      data: '02/07/2025',
      valor: 'R$ 200,00',
      status: 'andamento',
      prestador: 'Bruno'
    },
    {
      id: 3,
      titulo: 'Limpeza completa',
      categoria: 'Limpeza',
      endereco: 'Rua do Sol, 789 - Vila Nova',
      data: '04/06/2024',
      valor: 'R$ 180,00',
      status: 'concluido',
      prestador: 'Carol',
      avaliacao: 5
    }
  ]);

  const obterCorStatus = (status) => {
    switch (status) {
      case 'pendente': return CORES.AMARELA;
      case 'andamento': return CORES.SECUNDARIA;
      case 'concluido': return CORES.VERDE;
      default: return CORES.CINZA;
    }
  };

  const obterIconeStatus = (status) => {
    switch (status) {
      case 'pendente': return 'time-outline';
      case 'andamento': return 'alert-circle-outline';
      case 'concluido': return 'checkmark-circle-outline';
      default: return 'time-outline';
    }
  };

  const contarStatus = (status) => {
    return solicitacoes.filter(s => s.status === status).length;
  };

  const renderizarSolicitacao = ({ item }) => (
    <View style={styles.cartaoSolicitacao}>
      <View style={styles.cabecalhoSolicitacao}>
        <Text style={styles.tituloSolicitacao}>{item.titulo}</Text>
        <View style={[styles.badgeStatus, { backgroundColor: obterCorStatus(item.status) }]}>
          <Ionicons 
            name={obterIconeStatus(item.status)} 
            size={12} 
            color={CORES.BRANCA} 
            style={styles.iconeStatus}
          />
          <Text style={styles.textoStatus}>
            {item.status === 'pendente' && 'Pendente'}
            {item.status === 'andamento' && 'Em Andamento'}
            {item.status === 'concluido' && 'Concluído'}
          </Text>
        </View>
      </View>
      
      <View style={styles.detalhesContainer}>
        <Text style={styles.detalheTexto}>Endereço: {item.endereco}</Text>
        <Text style={styles.detalheTexto}>Data: {item.data}</Text>
        <Text style={styles.detalheTexto}>Categoria: {item.categoria}</Text>
        <Text style={styles.detalheTexto}>Valor: {item.valor}</Text>
      </View>

      {item.prestador && (
        <View style={styles.prestadorContainer}>
          <Ionicons name="person" size={16} color={CORES.CINZA} />
          <Text style={styles.prestadorTexto}>Prestador: {item.prestador}</Text>
          {item.avaliacao && (
            <View style={styles.avaliacaoContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < item.avaliacao ? "star" : "star-outline"}
                  size={14}
                  color={CORES.AMARELA}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Text style={styles.tituloCabecalho}>Dashboard - Cliente</Text>
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={styles.botaoCabecalho}
            onPress={() => navigation.navigate('TelaSelecionarPerfil')}
          >
            <Ionicons name="person" size={16} color={CORES.PRIMARIA} />
            <Text style={styles.textoBotaoCabecalho}>Prestador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoCabecalho}
            onPress={() => navigation.navigate('TelaInicial')}
          >
            <Ionicons name="log-out-outline" size={16} color={CORES.PRIMARIA} />
            <Text style={styles.textoBotaoCabecalho}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.conteudo}>
        {/* Menu Lateral */}
        <View style={styles.menuLateral}>
          <TouchableOpacity style={[styles.itemMenu, styles.itemMenuAtivo]}>
            <Text style={[styles.textoMenu, styles.textoMenuAtivo]}>Minhas Solicitações</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.itemMenu}
            onPress={() => navigation.navigate('TelaNovaSolicitacao')}
          >
            <Ionicons name="add" size={16} color={CORES.CINZA} />
            <Text style={styles.textoMenu}>Nova Solicitação</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemMenu}>
            <Ionicons name="star" size={16} color={CORES.CINZA} />
            <Text style={styles.textoMenu}>Avaliações Pendentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemMenu}>
            <Ionicons name="search" size={16} color={CORES.CINZA} />
            <Text style={styles.textoMenu}>Buscar Prestadores</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo Principal */}
        <View style={styles.principal}>
          <View style={styles.cabecalhoPrincipal}>
            <Text style={styles.tituloPrincipal}>Minhas Solicitações</Text>
            <Botao
              titulo="Nova Solicitação"
              aoPressionar={() => navigation.navigate('TelaNovaSolicitacao')}
              estilo={styles.botaoNova}
            />
          </View>

          {/* Cards de Status */}
          <View style={styles.cardsStatus}>
            <View style={styles.cardStatus}>
              <Ionicons name="time-outline" size={24} color={CORES.AMARELA} />
              <Text style={styles.numeroStatus}>{contarStatus('pendente')}</Text>
              <Text style={styles.labelStatus}>Pendentes</Text>
            </View>
            <View style={styles.cardStatus}>
              <Ionicons name="alert-circle-outline" size={24} color={CORES.SECUNDARIA} />
              <Text style={styles.numeroStatus}>{contarStatus('andamento')}</Text>
              <Text style={styles.labelStatus}>Em Andamento</Text>
            </View>
            <View style={styles.cardStatus}>
              <Ionicons name="checkmark-circle-outline" size={24} color={CORES.VERDE} />
              <Text style={styles.numeroStatus}>{contarStatus('concluido')}</Text>
              <Text style={styles.labelStatus}>Concluídos</Text>
            </View>
            <View style={styles.cardStatus}>
              <Ionicons name="star" size={24} color={CORES.LARANJA} />
              <Text style={styles.numeroStatus}>1</Text>
              <Text style={styles.labelStatus}>Avaliar</Text>
            </View>
          </View>

          {/* Lista de Solicitações */}
          <FlatList
            data={solicitacoes}
            renderItem={renderizarSolicitacao}
            keyExtractor={(item) => item.id.toString()}
            style={styles.listaSolicitacoes}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.CINZA_CLARO,
  },
  cabecalho: {
    backgroundColor: CORES.BRANCA,
    padding: ESPACAMENTOS.GRANDE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: CORES.CINZA,
    paddingTop: 50,
  },
  tituloCabecalho: {
    fontSize: TAMANHOS_FONTE.TITULO,
    fontWeight: 'bold',
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: ESPACAMENTOS.PEQUENO,
  },
  botaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESPACAMENTOS.PEQUENO,
    paddingVertical: ESPACAMENTOS.PEQUENO / 2,
    borderWidth: 1,
    borderColor: CORES.PRIMARIA,
    borderRadius: 4,
    gap: 4,
  },
  textoBotaoCabecalho: {
    fontSize: TAMANHOS_FONTE.PEQUENO,
    color: CORES.PRIMARIA,
  },
  conteudo: {
    flex: 1,
  },
  menuLateral: {
    backgroundColor: CORES.BRANCA,
    padding: ESPACAMENTOS.MEDIO,
    marginBottom: ESPACAMENTOS.PEQUENO,
  },
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ESPACAMENTOS.PEQUENO,
    gap: ESPACAMENTOS.PEQUENO,
  },
  itemMenuAtivo: {
    backgroundColor: CORES.CINZA_ESCURO,
    paddingHorizontal: ESPACAMENTOS.PEQUENO,
    borderRadius: 4,
  },
  textoMenu: {
    fontSize: TAMANHOS_FONTE.MEDIO,
    color: CORES.CINZA,
  },
  textoMenuAtivo: {
    color: CORES.BRANCA,
  },
  principal: {
    flex: 1,
    padding: ESPACAMENTOS.GRANDE,
  },
  cabecalhoPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.GRANDE,
  },
  tituloPrincipal: {
    fontSize: TAMANHOS_FONTE.TITULO_GRANDE,
    fontWeight: 'bold',
  },
  botaoNova: {
    paddingHorizontal: ESPACAMENTOS.MEDIO,
    paddingVertical: ESPACAMENTOS.PEQUENO,
  },
  cardsStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: ESPACAMENTOS.GRANDE,
    gap: ESPACAMENTOS.PEQUENO,
  },
  cardStatus: {
    backgroundColor: CORES.BRANCA,
    padding: ESPACAMENTOS.GRANDE,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    shadowColor: CORES.PRETA,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  numeroStatus: {
    fontSize: TAMANHOS_FONTE.TITULO,
    fontWeight: 'bold',
    marginVertical: ESPACAMENTOS.PEQUENO / 2,
  },
  labelStatus: {
    fontSize: TAMANHOS_FONTE.PEQUENO,
    color: CORES.CINZA,
  },
  listaSolicitacoes: {
    flex: 1,
  },
  cartaoSolicitacao: {
    backgroundColor: CORES.BRANCA,
    padding: ESPACAMENTOS.GRANDE,
    borderRadius: 8,
    marginBottom: ESPACAMENTOS.MEDIO,
    shadowColor: CORES.PRETA,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cabecalhoSolicitacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.PEQUENO,
  },
  tituloSolicitacao: {
    fontSize: TAMANHOS_FONTE.GRANDE,
    fontWeight: '600',
    flex: 1,
  },
  badgeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESPACAMENTOS.PEQUENO,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  iconeStatus: {
    marginRight: 2,
  },
  textoStatus: {
    fontSize: TAMANHOS_FONTE.PEQUENO,
    color: CORES.BRANCA,
    fontWeight: '500',
  },
  detalhesContainer: {
    marginVertical: ESPACAMENTOS.PEQUENO,
  },
  detalheTexto: {
    fontSize: TAMANHOS_FONTE.PEQUENO,
    color: CORES.CINZA,
    marginBottom: 2,
  },
  prestadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ESPACAMENTOS.PEQUENO,
    gap: ESPACAMENTOS.PEQUENO / 2,
  },
  prestadorTexto: {
    fontSize: TAMANHOS_FONTE.PEQUENO,
    color: CORES.CINZA_ESCURO,
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    marginLeft: ESPACAMENTOS.PEQUENO,
  },
});

export default TelaDashboardCliente;
