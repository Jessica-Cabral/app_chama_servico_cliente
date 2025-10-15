import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import { AuthContext } from '../context/AuthContext';

const DashboardCliente = ({ navigation }) => {
  const { usuario, token, logout } = useContext(AuthContext);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarSolicitacoes = async () => {
      try {
        const response = await fetch(
          `https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/solicitacoes?cliente_id=${usuario.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.sucesso) {
          setSolicitacoes(data.solicitacoes);
        }
      } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
      } finally {
        setCarregando(false);
      }
    };

    if (usuario && token) {
      buscarSolicitacoes();
    }
  }, [usuario, token]);

  const obterCorStatus = (status) => {
    switch (status) {
      case 'pendente': return '#f5a522';
      case 'andamento': return '#283579';
      case 'concluido': return '#10B981';
      default: return '#4e5264';
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
            color="#ffffff"
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
        <Text style={styles.detalheTexto}>Data: {item.data_atendimento}</Text>
        <Text style={styles.detalheTexto}>Categoria: {item.tipo_servico}</Text>
        <Text style={styles.detalheTexto}>Valor: R$ {item.orcamento_estimado}</Text>
      </View>
      {item.prestador && (
        <View style={styles.prestadorContainer}>
          <Ionicons name="person" size={16} color="#4e5264" />
          <Text style={styles.prestadorTexto}>Prestador: {item.prestador}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={styles.botaoCabecalho}
            onPress={() => navigation.navigate('PerfilCliente')}
          >
            <Ionicons name="person" size={16} color="#f5a522" />
            <Text style={styles.textoBotaoCabecalho}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoCabecalho}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={16} color="#f5a522" />
            <Text style={styles.textoBotaoCabecalho}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.conteudo}>
        <View style={styles.principal}>
          <View style={styles.cabecalhoPrincipal}>
            {/* <Text style={styles.tituloPrincipal}>Minhas Solicitações</Text> */}
            <Botao
              title="Nova Solicitação"
              onPress={() => navigation.navigate('NovaSolicitacao')}
              variante="primario"
            />
          </View>

          <View style={styles.cardsStatus}>
            <View style={styles.cardStatus}>
              <Ionicons name="time-outline" size={24} color="#f5a522" />
              <Text style={styles.numeroStatus}>{contarStatus('pendente')}</Text>
              <Text style={styles.labelStatus}>Pendentes</Text>
            </View>
            <View style={styles.cardStatus}>
              <Ionicons name="alert-circle-outline" size={24} color="#283579" />
              <Text style={styles.numeroStatus}>{contarStatus('andamento')}</Text>
              <Text style={styles.labelStatus}>Em Andamento</Text>
            </View>
            <View style={styles.cardStatus}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
              <Text style={styles.numeroStatus}>{contarStatus('concluido')}</Text>
              <Text style={styles.labelStatus}>Concluídos</Text>
            </View>
          </View>

          {carregando ? (
            <ActivityIndicator size="large" color="#f5a522" />
          ) : (
            <FlatList
              data={solicitacoes}
              renderItem={renderizarSolicitacao}
              keyExtractor={(item) => item.id.toString()}
              style={styles.listaSolicitacoes}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloCabecalho: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a112e',
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f5a522',
    borderRadius: 8,
  },
  textoBotaoCabecalho: {
    fontSize: 14,
    color: '#f5a522',
  },
  conteudo: { flex: 1 },
  principal: { flex: 1 },
  cabecalhoPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tituloPrincipal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a112e',
  },
  cardsStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardStatus: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    width: '30%',
  },
  numeroStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a112e',
    marginTop: 8,
  },
  labelStatus: {
    fontSize: 14,
    color: '#4e5264',
  },
  listaSolicitacoes: {
    marginBottom: 32,
  },
  cartaoSolicitacao: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cabecalhoSolicitacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tituloSolicitacao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a112e',
  },
  badgeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  iconeStatus: {
    marginRight: 4,
  },
  textoStatus: {
    fontSize: 12,
    color: '#ffffff',
  },
  detalhesContainer: {
    marginTop: 8,
  },
  detalheTexto: {
    fontSize: 14,
    color: '#4e5264',
    marginBottom: 4,
  },
  prestadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  prestadorTexto: {
    fontSize: 14,
    color: '#4e5264',
  },
});

export default DashboardCliente;