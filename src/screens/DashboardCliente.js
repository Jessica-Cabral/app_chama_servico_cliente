import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import Botao from '../components/Botao';
import CardSolicitacao from '../components/CardSolicitacao';
import MenuPerfil from '../components/menuPerfil';
import { carregarDadosDashboard } from '../services/dashboard';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardCliente = ({ navigation }) => {
  const { usuario, token, logout } = useContext(AuthContext);
  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [propostas, setPropostas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);
  const [menuPerfilVisible, setMenuPerfilVisible] = useState(false);

  // Função para carregar dados - EVITAR LOOP
const carregarDados = async () => {
    try {
      console.log('🔄 Iniciando carregamento no dashboard...');
      setCarregando(true);
      setErro(null);
      
      if (!usuario?.id || !token) {
        const erroMsg = 'Usuário não autenticado ou token ausente';
        console.error('❌', erroMsg);
        setErro(erroMsg);
        setCarregando(false);
        return;
      }

      // console.log('👤 Usuário ID:', usuario.id);
      // console.log('🔑 Token disponível:', !!token);

      const dados = await carregarDadosDashboard(usuario.id, token);
      //console.log('📊 Dados retornados do serviço:', dados);

      if (!dados) {
        throw new Error('Serviço retornou dados vazios');
      }

      if (dados.erro) {
        setErro(dados.erro);
      } else {
        setDadosPerfil(dados.perfil);
        setSolicitacoes(dados.solicitacoes || []);
        setPropostas(dados.propostas || []);
      }
    } catch (error) {
      console.error('💥 Erro no carregamento:', error);
      setErro(error.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setCarregando(false);
    }
  };

  // useEffect com dependências corretas
  useEffect(() => {
    console.log('🎯 Dashboard montado - carregando dados...');
    carregarDados();
  }, []);

  const onAtualizar = async () => {
    console.log('🔄 Atualizando dados manualmente...');
    setAtualizando(true);
    await carregarDados();
    setAtualizando(false);
  };

  // Contadores seguros
  const contarSolicitacoesPorStatus = (status) => {
    if (!solicitacoes || !Array.isArray(solicitacoes)) return 0;
    return solicitacoes.filter(sol => sol && sol.status === status).length;
  };

  const contarPropostasPendentes = () => {
    if (!propostas || !Array.isArray(propostas)) return 0;
    return propostas.filter(prop => prop && prop.status === 'pendente').length;
  };

  const obterIniciaisNome = (nome) => {
    return nome ? nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CL';
  };

  const abrirMenuPerfil = () => {
    setMenuPerfilVisible(true);
  };

  const fecharMenuPerfil = () => {
    setMenuPerfilVisible(false);
  };

  // Tela de loading
  if (carregando) {
    return (
      <View style={styles.carregandoContainer}>
        <Ionicons name="refresh-outline" size={40} color="#283579" />
        <Text style={styles.carregandoTexto}>Carregando dados...</Text>
        <Text style={styles.carregandoSubtexto}>Aguarde um momento</Text>
      </View>
    );
  }

  // Tela de erro
  if (erro) {
    return (
      <View style={styles.erroContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#f5a522" />
        <Text style={styles.erroTitulo}>Ops! Algo deu errado</Text>
        <Text style={styles.erroTexto}>{erro}</Text>
        <View style={styles.botoesErro}>
          <Botao
            title="Tentar Novamente"
            onPress={carregarDados}
            style={styles.botaoTentar}
          />
          <Botao
            title="Fazer Logout"
            onPress={logout}
            variante="outline"
            style={styles.botaoLogout}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com Avatar Clicável */}
      <LinearGradient colors={["#283579", "#0a112e"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.perfilButton}
            onPress={abrirMenuPerfil}
          >
            <View style={styles.avatar}>
              {dadosPerfil?.foto_perfil ? (
                <Image 
                  source={{ uri: dadosPerfil.foto_perfil }} 
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {obterIniciaisNome(usuario?.nome)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Text style={styles.boasVindas}>Olá, {usuario?.nome?.split(' ')[0] || 'Cliente'}!</Text>
            <Text style={styles.subtitulo}>Bem-vindo ao ChamaServiço</Text>
          </View>

          {/* Botão de Notificações */}
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notificacoes')}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={onAtualizar} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Cards de Resumo */}
        <View style={styles.resumoSection}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          
          <View style={styles.cardsGrid}>
            <View style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="document-text-outline" size={24} color="#283579" />
              </View>
              <Text style={styles.cardNumber}>{solicitacoes.length}</Text>
              <Text style={styles.cardLabel}>Total Solicitações</Text>
            </View>

            <View style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="cash-outline" size={24} color="#f5a522" />
              </View>
              <Text style={styles.cardNumber}>{contarPropostasPendentes()}</Text>
              <Text style={styles.cardLabel}>Propostas Pendentes</Text>
            </View>

            <View style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: '#e8f5e8' }]}>
                <Ionicons name="build-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.cardNumber}>{contarSolicitacoesPorStatus('andamento')}</Text>
              <Text style={styles.cardLabel}>Em Andamento</Text>
            </View>

            <View style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: '#f3e5f5' }]}>
                <Ionicons name="checkmark-done-outline" size={24} color="#8e24aa" />
              </View>
              <Text style={styles.cardNumber}>{contarSolicitacoesPorStatus('concluido')}</Text>
              <Text style={styles.cardLabel}>Concluídos</Text>
            </View>
          </View>
        </View>

        {/* Menu Principal Simplificado */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          
          <View style={styles.menuGrid}>
            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => navigation.navigate('Solicitacoes')}
            >
              <View style={[styles.menuCardIcon, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="document-text-outline" size={24} color="#283579" />
              </View>
              <Text style={styles.menuCardText}>Solicitações</Text>
              {solicitacoes.length > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{solicitacoes.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => navigation.navigate('Propostas')}
            >
              <View style={[styles.menuCardIcon, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="cash-outline" size={24} color="#f5a522" />
              </View>
              <Text style={styles.menuCardText}>Propostas</Text>
              {propostas.length > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{propostas.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Solicitações Recentes */}
        {solicitacoes.length > 0 ? (
          <View style={styles.solicitacoesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Solicitações Recentes</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Solicitacoes')}>
                <Text style={styles.verTudo}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            
            {solicitacoes.slice(0, 3).map((solicitacao, index) => (
              <CardSolicitacao key={solicitacao.id || index} item={solicitacao} />
            ))}
          </View>
        ) : (
          <View style={styles.semDadosContainer}>
            <Ionicons name="document-text-outline" size={50} color="#ccc" />
            <Text style={styles.semDadosTexto}>Nenhuma solicitação encontrada</Text>
            <Text style={styles.semDadosSubtexto}>
              Crie sua primeira solicitação de serviço
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botão Nova Solicitação Fixo */}
      <View style={styles.fabContainer}>
        <Botao
          title="Nova Solicitação"
          onPress={() => navigation.navigate('NovaSolicitacao')}
          style={styles.fabButton}
          icone={<Ionicons name="add" size={20} color="#fff" />}
        />
      </View>

      {/* Menu Perfil Modal */}
      <MenuPerfil
        visible={menuPerfilVisible}
        onClose={fecharMenuPerfil}
        navigation={navigation}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  carregandoTexto: {
    marginTop: 10,
    fontSize: 16,
    color: '#4e5264',
    fontWeight: '500',
  },
  carregandoSubtexto: {
    marginTop: 5,
    fontSize: 14,
    color: '#8e8e8e',
  },
  erroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  erroTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a112e',
    marginTop: 10,
    marginBottom: 5,
  },
  erroTexto: {
    fontSize: 14,
    color: '#f5a522',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  botoesErro: {
    width: '100%',
    gap: 10,
  },
  botaoTentar: {
    marginTop: 10,
  },
  botaoLogout: {
    marginTop: 5,
  },
  header: {
    backgroundColor: '#283579',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfilButton: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5a522',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  boasVindas: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
  },
  resumoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a112e',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a112e',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: '#4e5264',
    textAlign: 'center',
  },
  menuSection: {
    padding: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  menuCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuCardText: {
    fontSize: 12,
    color: '#0a112e',
    textAlign: 'center',
    fontWeight: '500',
  },
  menuBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f5a522',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  solicitacoesSection: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verTudo: {
    color: '#f5a522',
    fontSize: 14,
    fontWeight: '500',
  },
  semDadosContainer: {
    alignItems: 'center',
    padding: 40,
    marginVertical: 20,
  },
  semDadosTexto: {
    fontSize: 16,
    color: '#4e5264',
    marginTop: 10,
    textAlign: 'center',
  },
  semDadosSubtexto: {
    fontSize: 14,
    color: '#8e8e8e',
    marginTop: 5,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  fabButton: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default DashboardCliente;