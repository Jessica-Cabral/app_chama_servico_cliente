
import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { AuthContext } from "../context/AuthContext";
import Botao from '../components/Botao';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as PropostasService from '../services/propostas';


const ModalRecusa = ({ 
  visible, 
  onClose, 
  proposta, 
  motivo, 
  onMotivoChange, 
  onSubmit, 
  enviando 
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Recusar Proposta</Text>
            <TouchableOpacity onPress={onClose} disabled={enviando}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.recusaContent}>
            <Text style={styles.recusaInfo}>
              Você está recusando a proposta de{' '}
              <Text style={styles.recusaDestaque}>
                {proposta?.prestador_nome}
              </Text>{' '}
              para a solicitação{' '}
              <Text style={styles.recusaDestaque}>
                "{proposta?.solicitacao_titulo}"
              </Text>
            </Text>

            <Text style={styles.recusaLabel}>
              Motivo da recusa (opcional):
            </Text>
            
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Informe o motivo da recusa... (máximo de 500 caracteres)"
              value={motivo}
              onChangeText={onMotivoChange}
              maxLength={500}
              editable={!enviando}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            
            <Text style={styles.contadorCaracteres}>
              {motivo?.length || 0}/500 caracteres
            </Text>

            <View style={styles.recusaAviso}>
              <Icon name="info" size={16} color="#FF9800" />
              <Text style={styles.recusaAvisoText}>
                Esta ação não pode ser desfeita. O prestador será notificado da recusa.
              </Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <Botao
              title="Cancelar"
              variante="outline"
              onPress={onClose}
              disabled={enviando}
            />
            <Botao
              title={enviando ? "Recusando..." : "Confirmar Recusa"}
              variante="escuro"
              onPress={onSubmit}
              disabled={enviando}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Componente Modal de Detalhes separado
const ModalDetalhes = ({ 
  visible, 
  onClose, 
  proposta, 
  onAceitar, 
  onRecusar 
}) => {
  const podeAceitar = proposta?.status === 'pendente';
  const podeRecusar = proposta?.status === 'pendente';

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const obterCorStatus = (status) => {
    switch (status) {
      case 'aceita': return '#4CAF50';
      case 'recusada': return '#F44336';
      case 'pendente': return '#FF9800';
      default: return '#6c757d';
    }
  };

  const obterTextoStatus = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceita': return 'Aceita';
      case 'recusada': return 'Recusada';
      default: return status || 'Desconhecido';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes da Proposta</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {proposta && (
            <View style={styles.detalhesContent}>
              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesLabel}>Solicitação</Text>
                <Text style={styles.detalhesValue}>
                  {proposta.solicitacao_titulo || 'Solicitação sem título'}
                </Text>
              </View>

              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesLabel}>Descrição da Proposta</Text>
                <Text style={styles.detalhesValue}>
                  {proposta.descricao || 'Sem descrição'}
                </Text>
              </View>

              <View style={styles.detalhesRow}>
                <View style={styles.detalhesCol}>
                  <Text style={styles.detalhesLabel}>Valor</Text>
                  <Text style={styles.detalhesValor}>
                    {formatarMoeda(proposta.valor)}
                  </Text>
                </View>
                <View style={styles.detalhesCol}>
                  <Text style={styles.detalhesLabel}>Prazo</Text>
                  <Text style={styles.detalhesValue}>
                    {proposta.prazo_execucao || proposta.prazo_dias || 1} dia(s)
                  </Text>
                </View>
              </View>

              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesLabel}>Prestador</Text>
                <Text style={styles.detalhesValue}>
                  {proposta.prestador_nome || 'Prestador não informado'}
                </Text>
              </View>

              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesLabel}>Data de Recebimento</Text>
                <Text style={styles.detalhesValue}>
                  {formatarData(proposta.data_proposta)}
                </Text>
              </View>

              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesLabel}>Status</Text>
                <View style={styles.statusContainer}>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: obterCorStatus(proposta.status) }
                    ]} 
                  />
                  <Text style={styles.statusText}>
                    {obterTextoStatus(proposta.status)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {podeAceitar && podeRecusar && (
            <View style={styles.modalActions}>
              <Botao
                title="Aceitar Proposta"
                variante="primario"
                onPress={onAceitar}
              />
              <Botao
                title="Recusar Proposta"
                variante="outline"
                onPress={onRecusar}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Componente Modal de Filtros separado
const ModalFiltros = ({ visible, onClose, filtros, onFiltrosChange }) => {
  const opcoesStatus = [
    { label: 'Todos os status', value: '' },
    { label: 'Pendente', value: 'pendente' },
    { label: 'Aceita', value: 'aceita' },
    { label: 'Recusada', value: 'recusada' }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Propostas</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.filtroSection}>
            <Text style={styles.filtroLabel}>Status</Text>
            {opcoesStatus.map((opcao) => (
              <TouchableOpacity
                key={opcao.value}
                style={[
                  styles.filtroOpcao,
                  filtros.status === opcao.value && styles.filtroOpcaoSelecionada
                ]}
                onPress={() => onFiltrosChange({ ...filtros, status: opcao.value })}
              >
                <Text style={[
                  styles.filtroOpcaoText,
                  filtros.status === opcao.value && styles.filtroOpcaoTextSelecionada
                ]}>
                  {opcao.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Botao
              title="Limpar Filtros"
              variante="outline"
              onPress={() => onFiltrosChange({ status: '', solicitacao_id: '' })}
            />
            <Botao
              title="Aplicar Filtros"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Componente Principal
const PropostasRecebidas = () => {
  const { usuario } = useContext(AuthContext);
  const [propostas, setPropostas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalRecusa, setModalRecusa] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState(null);
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const [enviandoRecusa, setEnviandoRecusa] = useState(false);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    status: '',
    solicitacao_id: ''
  });

  useEffect(() => {
    carregarPropostas();
  }, [filtros]);

  const carregarPropostas = async () => {
    try {
      setCarregando(true);
      const resultado = await PropostasService.buscarPropostas(usuario.id, filtros);
      
      if (resultado.sucesso) {
        setPropostas(resultado.propostas || []);
      } else {
        Alert.alert('Erro', resultado.erro || 'Erro ao carregar propostas');
      }
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      Alert.alert('Erro', 'Erro ao carregar propostas');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const podeAceitarProposta = (proposta) => {
    return proposta.status === 'pendente';
  };

  const podeRecusarProposta = (proposta) => {
    return proposta.status === 'pendente';
  };

  const handleAceitarProposta = async (propostaId) => {
    Alert.alert(
      'Aceitar Proposta',
      'Tem certeza que deseja aceitar esta proposta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          style: 'default',
          onPress: async () => {
            try {
              const resultado = await PropostasService.aceitarProposta(usuario.id, propostaId);
              
              if (resultado.sucesso) {
                Alert.alert('Sucesso', 'Proposta aceita com sucesso!');
                carregarPropostas();
              } else {
                Alert.alert('Erro', resultado.erro || 'Erro ao aceitar proposta');
              }
            } catch (error) {
              console.error('Erro ao aceitar proposta:', error);
              Alert.alert('Erro', 'Erro ao aceitar proposta');
            }
          }
        }
      ]
    );
  };

  const handleAbrirModalRecusa = (proposta) => {
    setPropostaSelecionada(proposta);
    setMotivoRecusa('');
    setModalRecusa(true);
  };

  const handleRecusarProposta = async () => {
    if (!propostaSelecionada) return;

    setEnviandoRecusa(true);
    try {
      const resultado = await PropostasService.recusarProposta(usuario.id, propostaSelecionada.id, motivoRecusa);
      
      if (resultado.sucesso) {
        Alert.alert('Sucesso', 'Proposta recusada com sucesso!');
        setModalRecusa(false);
        carregarPropostas();
      } else {
        Alert.alert('Erro', resultado.erro || 'Erro ao recusar proposta');
      }
    } catch (error) {
      console.error('Erro ao recusar proposta:', error);
      Alert.alert('Erro', 'Erro ao recusar proposta');
    } finally {
      setEnviandoRecusa(false);
    }
  };

  const handleRecusaRapida = (propostaId) => {
    Alert.alert(
      'Recusar Proposta',
      'Tem certeza que deseja recusar esta proposta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: () => {
            const proposta = propostas.find(p => p.id === propostaId);
            if (proposta) {
              handleAbrirModalRecusa(proposta);
            }
          }
        }
      ]
    );
  };

  const handleVerDetalhes = (proposta) => {
    setPropostaSelecionada(proposta);
    setModalDetalhes(true);
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const obterCorStatus = (status) => {
    switch (status) {
      case 'aceita': return '#4CAF50';
      case 'recusada': return '#F44336';
      case 'pendente': return '#FF9800';
      default: return '#6c757d';
    }
  };

  const obterTextoStatus = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceita': return 'Aceita';
      case 'recusada': return 'Recusada';
      default: return status || 'Desconhecido';
    }
  };

  const CardProposta = ({ proposta }) => {
    const podeAceitar = podeAceitarProposta(proposta);
    const podeRecusar = podeRecusarProposta(proposta);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: obterCorStatus(proposta.status) }
              ]} 
            />
            <Text style={styles.statusText}>
              {obterTextoStatus(proposta.status)}
            </Text>
          </View>
          
          <View style={styles.valorContainer}>
            <Text style={styles.valor}>{formatarMoeda(proposta.valor)}</Text>
            <Text style={styles.prazo}>⏱ {proposta.prazo_execucao || proposta.prazo_dias || 1} dia(s)</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.tituloSolicitacao}>
            {proposta.solicitacao_titulo || 'Solicitação sem título'}
          </Text>
          
          <Text style={styles.descricao} numberOfLines={2}>
            {proposta.descricao || 'Sem descrição'}
          </Text>

          <View style={styles.prestadorInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {proposta.prestador_nome?.charAt(0) || 'P'}
              </Text>
            </View>
            <View>
              <Text style={styles.prestadorNome}>
                {proposta.prestador_nome || 'Prestador sem avaliações'}
              </Text>
              <Text style={styles.avaliacao}>⭐ 5.0 (0 avaliações)</Text>
            </View>
          </View>

          <Text style={styles.dataRecebimento}>
            Recebida em {formatarData(proposta.data_proposta)}
          </Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.btnDetalhes}
            onPress={() => handleVerDetalhes(proposta)}
          >
            <Text style={styles.btnDetalhesText}>Ver Detalhes</Text>
          </TouchableOpacity>
          
          <View style={styles.actionsGroup}>
            <Botao
              title="Aceitar"
              variante="primario"
              style={styles.btnAceitar}
              onPress={() => handleAceitarProposta(proposta.id)}
              disabled={!podeAceitar}
            />
            
            <Botao
              title="Recusar"
              variante="outline"
              style={styles.btnRecusar}
              onPress={() => handleRecusaRapida(proposta.id)}
              disabled={!podeRecusar}
            />
          </View>
        </View>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.carregandoContainer}>
        <ActivityIndicator size="large" color="#f5a522" />
        <Text style={styles.carregandoText}>Carregando propostas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Propostas Recebidas</Text>
        <Text style={styles.subtitulo}>
          Gerencie as propostas que você recebeu para suas solicitações
        </Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <TouchableOpacity 
          style={styles.btnFiltros}
          onPress={() => setModalFiltros(true)}
        >
          <Icon name="filter-list" size={20} color="#283579" />
          <Text style={styles.btnFiltrosText}>Filtrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnAtualizar}
          onPress={() => {
            setAtualizando(true);
            carregarPropostas();
          }}
        >
          <Icon 
            name="refresh" 
            size={20} 
            color="#283579" 
            style={atualizando && styles.rotating} 
          />
        </TouchableOpacity>
      </View>

      {/* Lista de Propostas */}
      {propostas.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Icon name="receipt" size={64} color="#ccc" />
          <Text style={styles.vazioTexto}>
            Nenhuma proposta recebida
          </Text>
          <Text style={styles.vazioSubtexto}>
            As propostas aparecerão aqui quando os prestadores responderem suas solicitações
          </Text>
        </View>
      ) : (
        <FlatList
          data={propostas}
          renderItem={({ item }) => <CardProposta proposta={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={carregarPropostas}
              colors={['#f5a522']}
            />
          }
          contentContainerStyle={styles.listaContent}
        />
      )}

      {/* Modais */}
      <ModalFiltros 
        visible={modalFiltros}
        onClose={() => setModalFiltros(false)}
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />

      <ModalDetalhes
        visible={modalDetalhes}
        onClose={() => setModalDetalhes(false)}
        proposta={propostaSelecionada}
        onAceitar={() => {
          setModalDetalhes(false);
          handleAceitarProposta(propostaSelecionada.id);
        }}
        onRecusar={() => {
          setModalDetalhes(false);
          handleAbrirModalRecusa(propostaSelecionada);
        }}
      />

      <ModalRecusa
        visible={modalRecusa}
        onClose={() => setModalRecusa(false)}
        proposta={propostaSelecionada}
        motivo={motivoRecusa}
        onMotivoChange={setMotivoRecusa}
        onSubmit={handleRecusarProposta}
        enviando={enviandoRecusa}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#283579',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6c757d',
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  btnFiltros: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  btnFiltrosText: {
    marginLeft: 8,
    color: '#283579',
    fontWeight: '500',
  },
  btnAtualizar: {
    padding: 8,
  },
  rotating: {
    transform: [{ rotate: '360deg' }],
  },
  listaContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
  },
  valorContainer: {
    alignItems: 'flex-end',
  },
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283579',
  },
  prazo: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  cardBody: {
    marginBottom: 16,
  },
  tituloSolicitacao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 12,
  },
  prestadorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#283579',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  prestadorNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
  },
  avaliacao: {
    fontSize: 12,
    color: '#6c757d',
  },
  dataRecebimento: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnDetalhes: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnDetalhesText: {
    color: '#283579',
    fontWeight: '500',
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  btnAceitar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  btnRecusar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  filtroSection: {
    padding: 20,
  },
  filtroLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  filtroOpcao: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  filtroOpcaoSelecionada: {
    backgroundColor: '#f5a522',
  },
  filtroOpcaoText: {
    fontSize: 14,
    color: '#495057',
  },
  filtroOpcaoTextSelecionada: {
    color: '#fff',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  detalhesContent: {
    padding: 20,
  },
  detalhesSection: {
    marginBottom: 20,
  },
  detalhesRow: {
    flexDirection: 'row',
    gap: 20,
  },
  detalhesCol: {
    flex: 1,
  },
  detalhesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  detalhesValue: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 22,
  },
  detalhesValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283579',
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carregandoText: {
    marginTop: 12,
    color: '#6c757d',
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  vazioTexto: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 8,
  },
  vazioSubtexto: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 20,
  },
   recusaContent: {
    padding: 20,
  },
  recusaInfo: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 20,
  },
  recusaDestaque: {
    fontWeight: 'bold',
    color: '#283579',
  },
  recusaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: '#f8f9fa',
  },
  contadorCaracteres: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 4,
  },
  recusaAviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  recusaAvisoText: {
    fontSize: 14,
    color: '#E65100',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});

export default PropostasRecebidas;