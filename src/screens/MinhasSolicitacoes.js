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
  Modal,
  RefreshControl,
  
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const MinhasSolicitacoes = ({ navigation }) => {
  const { usuario, token } = useContext(AuthContext);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [solicitacaoEditar, setSolicitacaoEditar] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    buscarSolicitacoes();
    
    // Atualizar a cada 30 segundos para status
    const intervalo = setInterval(buscarSolicitacoes, 30000);
    
    return () => clearInterval(intervalo);
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
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    buscarSolicitacoes();
  }, []);

// Verificar se pode editar/excluir - APENAS status "Aguardando proposta"
const podeEditarExcluir = (solicitacao) => {
  // Verifica por status_id (se disponível) ou por string do status
  const status = solicitacao.status?.toLowerCase() || solicitacao.status_nome?.toLowerCase() || '';
  
  // Status que permitem edição/exclusão
  const statusPermitidos = [
    'aguardando', 
    'aguardando propostas', 
    'pendente', 
    'em análise',
    '1' // status_id = 1
  ];
  
  return statusPermitidos.some(perm => status.includes(perm));
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
      case 'em análise':
        return { label: "Aguardando Propostas", cor: "#f5a522", icone: "time-outline" };
      case 'andamento':
      case 'em_andamento':
      case 'em andamento':
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

    // Filtro por status - CORREÇÃO
    if (filtroStatus !== "todos") {
      filtradas = filtradas.filter(s => {
        const status = s.status?.toLowerCase() || s.status_nome?.toLowerCase() || '';
        const filtro = filtroStatus.toLowerCase();
        
        // Mapeamento de filtros para status reais
        const mapeamento = {
          'aguardando': ['aguardando', 'pendente', 'em análise'],
          'andamento': ['andamento', 'em andamento', 'em_andamento'],
          'concluido': ['concluido', 'concluído'],
          'cancelado': ['cancelado']
        };
        
        if (mapeamento[filtro]) {
          return mapeamento[filtro].some(statusPermitido => status.includes(statusPermitido));
        }
        
        return status.includes(filtro);
      });
    }

    // Filtro por busca (mantido igual)
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
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : valor;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorNumerico);
  };

  const handleVerDetalhes = (solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalDetalhesVisivel(true);
  };

  const handleEditar = (solicitacao) => {
    if (podeEditarExcluir(solicitacao)) {
      // Navega para a aba "Solicitações" que tem acesso à NovaSolicitacao
     navigation.navigate('NovaSolicitacao', { 
      solicitacao: solicitacao 
    });
    } else {
      Alert.alert(
        "Edição não permitida",
      );
    }
  };

  const handleNovaSolicitacao = () => {
    // Navega para a aba "Solicitações" que tem acesso à NovaSolicitacao
    navigation.navigate('Solicitações', { 
      screen: 'NovaSolicitacao'
    });
  };

  const handleExcluir = (solicitacao) => {
    if (!podeEditarExcluir(solicitacao)) {
      Alert.alert(
        "Exclusão não permitida",
        "Esta solicitação não pode ser excluída pois não está mais aguardando propostas."
      );
      return;
    }

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
    // Verifica se a tela de Propostas existe antes de navegar
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Propostas', { 
        filtroSolicitacao: solicitacao.id 
      });
    } else {
      Alert.alert("Aviso", "Funcionalidade de propostas não disponível");
    }
  };

  const handleAtualizar = () => {
    buscarSolicitacoes();
    Alert.alert("Sucesso", "Lista atualizada!");
  };


  // Modal de Detalhes
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
                <Text style={styles.detalheValor}>
                  {solicitacaoSelecionada.tipo_servico || solicitacaoSelecionada.tipo_servico_nome || "Não informado"}
                </Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Endereço:</Text>
                <Text style={styles.detalheValor}>
                  {solicitacaoSelecionada.endereco || 
                   `${solicitacaoSelecionada.logradouro || ''} ${solicitacaoSelecionada.numero || ''}, ${solicitacaoSelecionada.bairro || ''}`.trim() || 
                   "Não informado"}
                </Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Data de Criação:</Text>
                <Text style={styles.detalheValor}>
                  {formatarData(solicitacaoSelecionada.data_criacao || solicitacaoSelecionada.data_solicitacao)}
                </Text>
              </View>
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Status:</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: obterStatusInfo(solicitacaoSelecionada.status || solicitacaoSelecionada.status_nome).cor }]}>
                    <Ionicons name={obterStatusInfo(solicitacaoSelecionada.status || solicitacaoSelecionada.status_nome).icone} size={14} color="#fff" />
                    <Text style={styles.statusText}>
                      {obterStatusInfo(solicitacaoSelecionada.status || solicitacaoSelecionada.status_nome).label}
                    </Text>
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
              
              <View style={styles.detalheItem}>
                <Text style={styles.detalheLabel}>Propostas Recebidas:</Text>
                <Text style={styles.detalheValor}>{solicitacaoSelecionada.total_propostas || 0}</Text>
              </View>
              
              {(solicitacaoSelecionada.orcamento_estimado > 0 || solicitacaoSelecionada.orcamento_estimado) && (
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
    const statusInfo = obterStatusInfo(item.status || item.status_nome);
    const urgenciaInfo = obterUrgenciaInfo(item.urgencia);
    const podeEditar = podeEditarExcluir(item);

    return (
      <View style={styles.card}>
        {/* Cabeçalho com data e status */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardData}>
            {formatarData(item.data_criacao || item.data_atendimento || item.data_solicitacao)}
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
              <Text style={styles.detalheTexto}>{item.tipo_servico || item.tipo_servico_nome || "Serviço"}</Text>
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
                {item.endereco || 
                 `${item.logradouro || ''} ${item.numero || ''}, ${item.bairro || ''}`.trim() || 
                 "Asa Sul, DF"}
              </Text>
            </View>
            
            {(item.orcamento_estimado > 0 || item.orcamento_estimado) && (
              <View style={styles.detalheItem}>
                <Ionicons name="cash-outline" size={16} color="#4e5264" />
                <Text style={styles.detalheTexto}>
                  {formatarMoeda(item.orcamento_estimado)}
                </Text>
              </View>
            )}
          </View>

          {/* Informação de propostas */}
          <View style={styles.propostasInfo}>
            <Ionicons name="document-text-outline" size={14} color="#4e5264" />
            <Text style={styles.propostasInfoTexto}>
              {item.total_propostas || 0} proposta(s) recebida(s)
            </Text>
          </View>
        </View>

        {/* Ações - Botões condicionais */}
        <View style={styles.cardAcoes}>
          <TouchableOpacity 
            style={styles.acaoBtn}
            onPress={() => handleVerDetalhes(item)}
          >
            <Ionicons name="eye-outline" size={16} color="#283579" />
            <Text style={styles.acaoTexto}>Ver</Text>
          </TouchableOpacity>

          {/* Botão Editar - APENAS se status for "Aguardando proposta" */}
          {podeEditar && (
            <TouchableOpacity 
              style={styles.acaoBtn}
              onPress={() => handleEditar(item)}
            >
              <Ionicons name="create-outline" size={16} color="#f5a522" />
              <Text style={styles.acaoTexto}>Editar</Text>
            </TouchableOpacity>
          )}

          {/* Botão Excluir - APENAS se status for "Aguardando proposta" */}
          {podeEditar && (
            <TouchableOpacity 
              style={styles.acaoBtn}
              onPress={() => handleExcluir(item)}
            >
              <Ionicons name="trash-outline" size={16} color="#dc3545" />
              <Text style={styles.acaoTexto}>Excluir</Text>
            </TouchableOpacity>
          )}
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

  if (carregando && !refreshing) {
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
      <LinearGradient colors={["#283579", "#0a112e"]} style={styles.header}>
        <Text style={styles.titulo}>Minhas Solicitações</Text>
        <View style={styles.headerAcoes}>
          <TouchableOpacity 
            style={styles.atualizarBtn}
            onPress={handleAtualizar}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.novoBtn}
            onPress={handleNovaSolicitacao}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#f5a522"]}
            tintColor="#f5a522"
          />
        }
      >
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
                onPress={handleNovaSolicitacao}
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

// ... (os estilos permanecem EXATAMENTE os mesmos)
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
  headerAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  atualizarBtn: {
    padding: 6,
  },
  novoBtn: {
    padding: 6,
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
  propostasInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  propostasInfoTexto: {
    fontSize: 12,
    color: "#4e5264",
    fontWeight: "500",
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
    color: '#0a112e',
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