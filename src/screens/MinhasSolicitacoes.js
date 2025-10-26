import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const MinhasSolicitacoes = ({ navigation }) => {
  const { usuario, token } = useContext(AuthContext);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  useEffect(() => {
    buscarSolicitacoes();
  }, [usuario, token]);

  const buscarSolicitacoes = async () => {
    try {
      setCarregando(true);
      const response = await fetch(
        `https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/solicitacoes?cliente_id=${usuario.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.sucesso) {
        setSolicitacoes(data.solicitacoes || []);
      } else {
        console.error("Erro ao buscar solicitações:", data.erro);
        Alert.alert("Erro", "Não foi possível carregar as solicitações");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  const statusOpcoes = [
    { label: "Todos", value: "todos" },
    { label: "Aguardando", value: "aguardando" },
    { label: "Em andamento", value: "andamento" },
    { label: "Concluído", value: "concluido" },
    { label: "Cancelado", value: "cancelado" },
  ];

  const obterStatusInfo = (status) => {
    const statusLower = status?.toLowerCase() || 'aguardando';
    switch (statusLower) {
      case 'aguardando':
      case 'pendente':
        return { label: "Aguardando Propostas", cor: "#f5a522", icone: "time-outline" };
      case 'andamento':
      case 'em_andamento':
        return { label: "Em Andamento", cor: "#007bff", icone: "sync-outline" };
      case 'concluido':
      case 'concluído':
        return { label: "Concluído", cor: "#28a745", icone: "checkmark-circle-outline" };
      case 'cancelado':
        return { label: "Cancelado", cor: "#dc3545", icone: "close-circle-outline" };
      default:
        return { label: status || "Aguardando", cor: "#6c757d", icone: "help-circle-outline" };
    }
  };

  const obterUrgenciaInfo = (urgencia) => {
    const urgenciaLower = urgencia?.toLowerCase() || 'media';
    switch (urgenciaLower) {
      case 'alta':
        return { label: "Alta", cor: "#dc3545", icone: "alert-circle" };
      case 'media':
      case 'média':
        return { label: "Média", cor: "#f5a522", icone: "time" };
      case 'baixa':
        return { label: "Baixa", cor: "#28a745", icone: "checkmark-circle" };
      default:
        return { label: "Média", cor: "#6c757d", icone: "help-circle" };
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...solicitacoes];

    // Filtro por status
    if (filtroStatus !== "todos") {
      filtradas = filtradas.filter(s => {
        const statusNormalizado = s.status?.toLowerCase().replace(/[^a-z]/g, '');
        const filtroNormalizado = filtroStatus.toLowerCase().replace(/[^a-z]/g, '');
        return statusNormalizado === filtroNormalizado;
      });
    }

    // Filtro por busca
    if (buscaTexto.trim() !== "") {
      const texto = buscaTexto.toLowerCase();
      filtradas = filtradas.filter(
        (s) =>
          s.titulo?.toLowerCase().includes(texto) ||
          s.descricao?.toLowerCase().includes(texto) ||
          s.tipo_servico?.toLowerCase().includes(texto)
      );
    }

    return filtradas;
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dataString;
    }
  };

  const formatarMoeda = (valor) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleVerDetalhes = (solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalDetalhesVisivel(true);
  };

  const handleEditar = (solicitacao) => {
    navigation.navigate('NovaSolicitacao', { 
      solicitacao: {
        ...solicitacao,
        tipo_servico_id: solicitacao.tipo_servico_id || solicitacao.tipo_servico
      } 
    });
  };

  const handleExcluir = (solicitacao) => {
    Alert.alert(
      "Excluir Solicitação",
      `Tem certeza que deseja excluir a solicitação "${solicitacao.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => excluirSolicitacao(solicitacao.id)
        }
      ]
    );
  };

  const excluirSolicitacao = async (solicitacaoId) => {
    try {
      const response = await fetch(
        `https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/solicitacoes`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cliente_id: usuario.id,
            solicitacao_id: solicitacaoId
          })
        }
      );
      
      const data = await response.json();
      
      if (data.sucesso) {
        setSolicitacoes(prev => prev.filter(s => s.id !== solicitacaoId));
        Alert.alert("Sucesso", "Solicitação excluída com sucesso!");
      } else {
        Alert.alert("Erro", data.erro || "Erro ao excluir solicitação");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Erro ao excluir solicitação");
    }
  };

  const handleVerPropostas = (solicitacao) => {
    navigation.navigate('Propostas', { 
      filtroSolicitacao: solicitacao.id 
    });
  };

  const ModalDetalhes = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalDetalhesVisivel}
      onRequestClose={() => setModalDetalhesVisivel(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Detalhes da Solicitação</Text>
            <TouchableOpacity 
              onPress={() => setModalDetalhesVisivel(false)}
              style={styles.modalFecharBtn}
            >
              <Ionicons name="close" size={24} color="#4e5264" />
            </TouchableOpacity>
          </View>

          {solicitacaoSelecionada && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Título:</Text>
                <Text style={styles.detalheValor}>{solicitacaoSelecionada.titulo}</Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Descrição:</Text>
                <Text style={styles.detalheValor}>{solicitacaoSelecionada.descricao}</Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Tipo de Serviço:</Text>
                <Text style={styles.detalheValor}>{solicitacaoSelecionada.tipo_servico}</Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Endereço:</Text>
                <Text style={styles.detalheValor}>{solicitacaoSelecionada.endereco || "Não informado"}</Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Data de Criação:</Text>
                <Text style={styles.detalheValor}>{formatarData(solicitacaoSelecionada.data_criacao)}</Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Status:</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: obterStatusInfo(solicitacaoSelecionada.status).cor }]}>
                    <Ionicons name={obterStatusInfo(solicitacaoSelecionada.status).icone} size={14} color="#fff" />
                    <Text style={styles.statusText}>{obterStatusInfo(solicitacaoSelecionada.status).label}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Urgência:</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.urgenciaBadge}>
                    <Ionicons name={obterUrgenciaInfo(solicitacaoSelecionada.urgencia).icone} size={14} color={obterUrgenciaInfo(solicitacaoSelecionada.urgencia).cor} />
                    <Text style={[styles.urgenciaTexto, { color: obterUrgenciaInfo(solicitacaoSelecionada.urgencia).cor }]}>
                      {obterUrgenciaInfo(solicitacaoSelecionada.urgencia).label}
                    </Text>
                  </View>
                </View>
              </View>
              
              {solicitacaoSelecionada.orcamento_estimado > 0 && (
                <View style={styles.detalheItem}>
                  <Text style={styles.detalheLabel}>Orçamento Estimado:</Text>
                  <Text style={styles.detalheValor}>{formatarMoeda(solicitacaoSelecionada.orcamento_estimado)}</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderItem = ({ item }) => {
    const statusInfo = obterStatusInfo(item.status);
    const urgenciaInfo = obterUrgenciaInfo(item.urgencia);

    return (
      <View style={styles.card}>
        {/* Cabeçalho com data e status */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardData}>
            {formatarData(item.data_criacao || item.data_atendimento)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.cor }]}>
            <Ionicons name={statusInfo.icone} size={14} color="#fff" />
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>
        </View>

        {/* Informações principais */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
          <Text style={styles.cardDescricao} numberOfLines={2}>
            {item.descricao}
          </Text>
          
          <View style={styles.detalhesRow}>
            <View style={styles.detalheItem}>
              <Ionicons name="business-outline" size={16} color="#4e5264" />
              <Text style={styles.detalheTexto}>{item.tipo_servico || "Serviço"}</Text>
            </View>
            
            <View style={styles.detalheItem}>
              <Ionicons name={urgenciaInfo.icone} size={16} color={urgenciaInfo.cor} />
              <Text style={[styles.detalheTexto, { color: urgenciaInfo.cor }]}>
                {urgenciaInfo.label}
              </Text>
            </View>
          </View>

          <View style={styles.detalhesRow}>
            <View style={styles.detalheItem}>
              <Ionicons name="location-outline" size={16} color="#4e5264" />
              <Text style={styles.detalheTexto}>
                {item.endereco || "Asa Sul, DF"}
              </Text>
            </View>
            
            {item.orcamento_estimado > 0 && (
              <View style={styles.detalheItem}>
                <Ionicons name="cash-outline" size={16} color="#4e5264" />
                <Text style={styles.detalheTexto}>
                  {formatarMoeda(item.orcamento_estimado)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Ações */}
        <View style={styles.cardAcoes}>
          <TouchableOpacity 
            style={styles.acaoBtn}
            onPress={() => handleVerDetalhes(item)}
          >
            <Ionicons name="eye-outline" size={16} color="#283579" />
            <Text style={styles.acaoTexto}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.acaoBtn}
            onPress={() => handleEditar(item)}
          >
            <Ionicons name="create-outline" size={16} color="#f5a522" />
            <Text style={styles.acaoTexto}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.acaoBtn}
            onPress={() => handleExcluir(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#dc3545" />
            <Text style={styles.acaoTexto}>Excluir</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Ver Propostas */}
        <TouchableOpacity 
          style={styles.propostasBtn}
          onPress={() => handleVerPropostas(item)}
        >
          <Ionicons name="document-text-outline" size={16} color="#283579" />
          <Text style={styles.propostasTexto}>Ver Propostas Recebidas</Text>
          <Ionicons name="chevron-forward" size={16} color="#283579" />
        </TouchableOpacity>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <Ionicons name="refresh-outline" size={40} color="#f5a522" />
        <Text style={styles.loadingText}>Carregando solicitações...</Text>
      </View>
    );
  }

  const solicitacoesFiltradas = aplicarFiltros();

  return (
    <View style={styles.container}>
      {/* Header com botão de nova solicitação */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Minhas Solicitações</Text>
        <TouchableOpacity 
          style={styles.novoBtn}
          onPress={() => navigation.navigate('NovaSolicitacao')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Filtros */}
        <View style={styles.filtrosContainer}>
          <Text style={styles.filtrosTitulo}>Filtros</Text>
          
          {/* Campo de busca */}
          <View style={styles.buscaContainer}>
            <Ionicons name="search-outline" size={20} color="#4e5264" />
            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar por título ou descrição..."
              placeholderTextColor="#999"
              value={buscaTexto}
              onChangeText={setBuscaTexto}
            />
          </View>

          {/* Filtro de status */}
          <Text style={styles.filtroLabel}>Status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosScroll}>
            {statusOpcoes.map((opcao) => (
              <TouchableOpacity
                key={opcao.value}
                onPress={() => setFiltroStatus(opcao.value)}
                style={[
                  styles.filtroBotao,
                  filtroStatus === opcao.value && styles.filtroBotaoAtivo,
                ]}
              >
                <Text
                  style={[
                    styles.filtroTexto,
                    filtroStatus === opcao.value && styles.filtroTextoAtivo,
                  ]}
                >
                  {opcao.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de solicitações */}
        {solicitacoesFiltradas.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={styles.vazioTexto}>
              {solicitacoes.length === 0
                ? "Você ainda não fez nenhuma solicitação."
                : "Nenhuma solicitação encontrada para este filtro."}
            </Text>
            {solicitacoes.length === 0 && (
              <TouchableOpacity 
                style={styles.novaSolicitacaoBtn}
                onPress={() => navigation.navigate('NovaSolicitacao')}
              >
                <Text style={styles.novaSolicitacaoTexto}>Criar Primeira Solicitação</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={solicitacoesFiltradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
            contentContainerStyle={styles.lista}
          />
        )}
      </ScrollView>

      <ModalDetalhes />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#283579",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  novoBtn: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  filtrosContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
  },
  filtrosTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a112e",
    marginBottom: 12,
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  inputBusca: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#0a112e",
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0a112e",
    marginBottom: 8,
  },
  filtrosScroll: {
    marginBottom: 8,
  },
  filtroBotao: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  filtroBotaoAtivo: {
    backgroundColor: "#f5a522",
    borderColor: "#f5a522",
  },
  filtroTexto: {
    color: "#4e5264",
    fontSize: 14,
    fontWeight: "500",
  },
  filtroTextoAtivo: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  lista: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  cardData: {
    fontSize: 14,
    color: "#4e5264",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  cardContent: {
    marginBottom: 16,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a112e",
    marginBottom: 8,
  },
  cardDescricao: {
    fontSize: 14,
    color: "#4e5264",
    lineHeight: 20,
    marginBottom: 12,
  },
  detalhesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detalheItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  detalheTexto: {
    fontSize: 14,
    color: "#4e5264",
  },
  cardAcoes: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 12,
    marginBottom: 12,
  },
  acaoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  acaoTexto: {
    fontSize: 14,
    fontWeight: "500",
  },
  propostasBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  propostasTexto: {
    color: "#283579",
    fontSize: 14,
    fontWeight: "500",
  },
  vazioContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  vazioTexto: {
    fontSize: 16,
    color: "#4e5264",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  novaSolicitacaoBtn: {
    backgroundColor: "#f5a522",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  novaSolicitacaoTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 16,
    color: "#4e5264",
    marginTop: 12,
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 0,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a112e',
  },
  modalFecharBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  detalheItem: {
    marginBottom: 16,
  },
  detalheLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4e5264',
    marginBottom: 4,
  },
  detalheValor: {
    fontSize: 16,
    color: 'dataHoraLabel',
  },
  statusContainer: {
    flexDirection: 'row',
  },
  urgenciaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  urgenciaTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MinhasSolicitacoes;