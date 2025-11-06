import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Importando serviços
import { 
  consultarPerfil, 
  atualizarPerfil, 
  alterarSenha,
  masks,
  validators,
  formatarDataParaExibicao 
} from '../services/perfil';
import { 
  listarEnderecos, 
  definirEnderecoPrincipal, 
  excluirEndereco
} from '../services/enderecos';

// Importando componentes
import ModalEndereco from '../components/ModalEndereco';

const PerfilCliente = ({ navigation }) => {
  const { usuario, token, atualizarUsuario, logout } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
  const [modalAlterarSenha, setModalAlterarSenha] = useState(false);
  const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
  const [carregandoPrincipal, setCarregandoPrincipal] = useState(false);

  // Estados para edição do perfil
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');
  const [erros, setErros] = useState({});

  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setCarregando(true);
      
      // Carregar dados do perfil
      const perfilData = await consultarPerfil(usuario.id, token);
      
      if (perfilData.erro) {
        console.error('Erro ao carregar perfil:', perfilData.erro);
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
      } else {
        setPerfil(perfilData);
        
        // Preencher dados para edição com máscaras
        setNome(perfilData.nome || '');
        setEmail(perfilData.email || '');
        
        // Formatar telefone para exibição
        const telefoneFormatado = perfilData.telefone ? masks.telefone(perfilData.telefone) : '';
        setTelefone(telefoneFormatado);
        
        // Formatar CPF para exibição
        const cpfFormatado = perfilData.cpf ? masks.cpf(perfilData.cpf) : '';
        setCpf(cpfFormatado);
        
        // Formatar data para exibição (DD/MM/YYYY)
        const dataFormatada = perfilData.dt_nascimento ? formatarDataParaExibicao(perfilData.dt_nascimento) : '';
        setDtNascimento(dataFormatada);
      }

      // Carregar endereços
      const enderecosData = await listarEnderecos(usuario.id, token);
      
      if (!enderecosData.erro) {
        setEnderecos(enderecosData.enderecos || []);
      }
      
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    carregarPerfil();
  }, []);

  const handleEditarPerfil = () => {
    setModalEditarPerfil(true);
    setErros({});
  };

  const handleInputChange = (campo, valor) => {
    let valorFormatado = valor;

    // Aplicar máscaras em tempo real
    switch (campo) {
      case 'telefone':
        valorFormatado = masks.telefone(valor);
        setTelefone(valorFormatado);
        break;
      case 'cpf':
        // Só permite editar CPF se não foi preenchido anteriormente
        if (!perfil?.cpf) {
          valorFormatado = masks.cpf(valor);
          setCpf(valorFormatado);
        }
        break;
      case 'dtNascimento':
        // Só permite editar data se não foi preenchida anteriormente
        if (!perfil?.dt_nascimento) {
          valorFormatado = masks.data(valor);
          setDtNascimento(valorFormatado);
        }
        break;
      case 'nome':
        setNome(valor);
        break;
      case 'email':
        setEmail(valor);
        break;
    }

    // Limpar erro do campo
    if (erros[campo]) {
      setErros(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'Email inválido';
    }

    // Validar CPF apenas se estiver preenchido e não foi preenchido anteriormente
    if (cpf && !perfil?.cpf) {
      const cpfLimpo = cpf.replace(/\D/g, '');
      if (cpfLimpo.length > 0 && !validators.cpf(cpfLimpo)) {
        novosErros.cpf = 'CPF inválido';
      }
    }

    // Validar data apenas se estiver preenchida e não foi preenchida anteriormente
    if (dtNascimento && !perfil?.dt_nascimento) {
      if (!validators.data(dtNascimento)) {
        novosErros.dtNascimento = 'Data de nascimento inválida';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarPerfil = async () => {
    // Validar campos obrigatórios
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    // Validar email
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    // Validar CPF se estiver preenchido e não foi preenchido anteriormente
    if (cpf && cpf.replace(/\D/g, '').length > 0 && !perfil?.cpf) {
      const cpfLimpo = cpf.replace(/\D/g, '');
      if (cpfLimpo.length !== 11 || !validators.cpf(cpfLimpo)) {
        Alert.alert('Erro', 'CPF inválido');
        return;
      }
    }

    // Validar data se estiver preenchida e não foi preenchida anteriormente
    if (dtNascimento && dtNascimento.length > 0 && !perfil?.dt_nascimento) {
      if (!validators.data(dtNascimento)) {
        Alert.alert('Erro', 'Data de nascimento inválida');
        return;
      }
    }

    try {
      const result = await atualizarPerfil(
        usuario.id,
        nome,
        email,
        telefone,
        cpf,
        dtNascimento,
        token
      );
      
      if (result.erro) {
        Alert.alert('Erro', result.erro || 'Erro ao atualizar perfil');
      } else {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        setModalEditarPerfil(false);
        carregarPerfil();
        
        // Atualizar contexto global (com verificação de segurança)
        if (typeof atualizarUsuario === 'function') {
          atualizarUsuario({ ...usuario, nome, email, telefone });
        } else {
          console.warn('atualizarUsuario não está disponível no contexto');
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  // Função para formatar CPF para exibição
  const formatarCpfParaExibicao = (cpf) => {
    if (!cpf) return '';
    return masks.cpf(cpf);
  };

  // Função para formatar telefone para exibição
  const formatarTelefoneParaExibicao = (telefone) => {
    if (!telefone) return '';
    return masks.telefone(telefone);
  };

  // Resto das funções permanecem iguais...
  const handleAlterarSenha = () => {
    setModalAlterarSenha(true);
  };

  const salvarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const result = await alterarSenha(
        usuario.id,
        senhaAtual,
        novaSenha,
        token
      );
      
      if (result.erro) {
        Alert.alert('Erro', result.erro || 'Erro ao alterar senha');
      } else {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
        setModalAlterarSenha(false);
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  const handleDefinirPrincipal = async (enderecoId) => {
    setCarregandoPrincipal(true);
    try {
      const response = await definirEnderecoPrincipal(
        usuario.id,
        enderecoId,
        token
      );
      if (response.sucesso) {
        Alert.alert("Sucesso", "Endereço definido como principal");
        carregarPerfil();
      } else {
        Alert.alert("Erro", response.erro || "Não foi possível atualizar");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao definir endereço principal");
    } finally {
      setCarregandoPrincipal(false);
    }
  };

  const handleExcluirEndereco = (endereco) => {
    const enderecoPrincipal = enderecos.find(e => e.principal === 1 || e.principal === "1");
    if (enderecoPrincipal && enderecoPrincipal.id === endereco.id) {
      Alert.alert('Aviso', 'Não é possível excluir o endereço principal');
      return;
    }

    Alert.alert(
      'Excluir Endereço',
      `Tem certeza que deseja excluir o endereço ${endereco.logradouro}, ${endereco.numero}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => excluirEnderecoConfirmado(endereco.id)
        }
      ]
    );
  };

  const excluirEnderecoConfirmado = async (enderecoId) => {
    try {
      const result = await excluirEndereco(usuario.id, enderecoId, token);
      
      if (result.erro) {
        Alert.alert('Erro', result.erro || 'Erro ao excluir endereço');
      } else {
        Alert.alert('Sucesso', 'Endereço excluído com sucesso!');
        carregarPerfil();
      }
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  const handleAdicionarEndereco = () => {
    setModalEnderecoVisible(true);
  };

  const handleEnderecoCadastrado = () => {
    carregarPerfil();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  if (carregando && !refreshing) {
    return (
      <View style={styles.loading}>
        <Ionicons name="person-circle-outline" size={40} color="#f5a522" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#283579", "#0a112e"]} style={styles.header}>
        <Text style={styles.titulo}>Meu Perfil</Text>
        <TouchableOpacity 
          style={styles.atualizarBtn}
          onPress={carregarPerfil}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
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
        {/* Seção: Dados Pessoais */}
        <View style={styles.secao}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Dados Pessoais</Text>
            <TouchableOpacity onPress={handleEditarPerfil}>
              <Ionicons name="create-outline" size={20} color="#283579" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={16} color="#4e5264" />
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValor}>{perfil?.nome || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={16} color="#4e5264" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValor}>{perfil?.email || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={16} color="#4e5264" />
              <Text style={styles.infoLabel}>Telefone:</Text>
              <Text style={styles.infoValor}>
                {perfil?.telefone ? formatarTelefoneParaExibicao(perfil.telefone) : 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={16} color="#4e5264" />
              <Text style={styles.infoLabel}>CPF:</Text>
              <Text style={styles.infoValor}>
                {perfil?.cpf ? formatarCpfParaExibicao(perfil.cpf) : 'Não informado'}
                {perfil?.cpf && (
                  <Text style={styles.campoBloqueado}> (Não editável)</Text>
                )}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#4e5264" />
              <Text style={styles.infoLabel}>Data Nasc.:</Text>
              <Text style={styles.infoValor}>
                {perfil?.dt_nascimento ? formatarDataParaExibicao(perfil.dt_nascimento) : 'Não informada'}
                {perfil?.dt_nascimento && (
                  <Text style={styles.campoBloqueado}> (Não editável)</Text>
                )}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.alterarSenhaBtn} onPress={handleAlterarSenha}>
            <Ionicons name="key-outline" size={16} color="#283579" />
            <Text style={styles.alterarSenhaTexto}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Meus Endereços */}
        <View style={styles.secao}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Meus Endereços</Text>
            <TouchableOpacity onPress={handleAdicionarEndereco}>
              <Ionicons name="add-circle-outline" size={20} color="#283579" />
            </TouchableOpacity>
          </View>

          {enderecos.length === 0 ? (
            <View style={styles.vazioContainer}>
              <Ionicons name="location-outline" size={40} color="#ccc" />
              <Text style={styles.vazioTexto}>Nenhum endereço cadastrado</Text>
              <TouchableOpacity 
                style={styles.novoEnderecoBtn}
                onPress={handleAdicionarEndereco}
              >
                <Text style={styles.novoEnderecoTexto}>Adicionar Primeiro Endereço</Text>
              </TouchableOpacity>
            </View>
          ) : (
            enderecos.map((endereco) => (
              <View key={endereco.id} style={styles.card}>
                <View style={styles.enderecoHeader}>
                  <View style={styles.enderecoTitulo}>
                    <Text> {endereco.principal === "1" && (
                        <View style={styles.principalBadge}>
                          <Ionicons name="star" size={12} color="#fff" />
                          <Text style={styles.principalTexto}>Principal</Text>
                        </View>
                      )}
                    </Text> 
                    <Text style={styles.enderecoNome}>
                      {endereco.logradouro}, {endereco.numero}
                    </Text>
                  </View>
                  
                  <View style={styles.enderecoAcoes}>
                    <Text>
                        {endereco.principal !== "1" && (
                          <TouchableOpacity 
                            style={styles.acaoBtn}
                            onPress={() => handleDefinirPrincipal(endereco.id)}
                            disabled={carregandoPrincipal}
                          >
                            {carregandoPrincipal ? (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#f5a522" />
                                <Text style={{ marginLeft: 8, color: '#f5a522' }}>Carregando...</Text>
                              </View>
                            ) : (
                              <Ionicons name="star-outline" size={16} color="#f5a522" />
                            )}
                          </TouchableOpacity>
                       )}
                    </Text>
                    <TouchableOpacity 
                      style={styles.acaoBtn}
                      onPress={() => handleExcluirEndereco(endereco)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.enderecoInfo}>
                  <Text style={styles.enderecoTexto}>Bairro: {endereco.bairro}</Text>
                  <Text style={styles.enderecoTexto}>Complemento: {endereco.complemento}</Text>
                  <Text style={styles.enderecoTexto}>CEP: {endereco.cep}</Text>
                  <Text style={styles.enderecoTexto}>
                    {endereco.cidade} - {endereco.estado}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Seção: Ações da Conta */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Ações da Conta</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={16} color="#dc3545" />
            <Text style={styles.logoutTexto}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal: Editar Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditarPerfil}
        onRequestClose={() => setModalEditarPerfil(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setModalEditarPerfil(false)}>
                <Ionicons name="close" size={24} color="#4e5264" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome *</Text>
                <TextInput
                  style={[styles.input, erros.nome && styles.inputError]}
                  value={nome}
                  onChangeText={(text) => handleInputChange('nome', text)}
                  placeholder="Digite seu nome"
                />
                {erros.nome && <Text style={styles.erroTexto}>{erros.nome}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={[styles.input, erros.email && styles.inputError]}
                  value={email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {erros.email && <Text style={styles.erroTexto}>{erros.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone *</Text>
                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={(text) => handleInputChange('telefone', text)}
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CPF {perfil?.cpf ? '(Não editável)' : ''}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    (perfil?.cpf && styles.inputDisabled),
                    erros.cpf && styles.inputError
                  ]}
                  value={cpf}
                  onChangeText={(text) => handleInputChange('cpf', text)}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  editable={!perfil?.cpf}
                />
                {erros.cpf && <Text style={styles.erroTexto}>{erros.cpf}</Text>}
                {perfil?.cpf && (
                  <Text style={styles.infoTexto}>CPF não pode ser alterado após o cadastro</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Data Nasc. {perfil?.dt_nascimento ? '(Não editável)' : ''}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    (perfil?.dt_nascimento && styles.inputDisabled),
                    erros.dtNascimento && styles.inputError
                  ]}
                  value={dtNascimento}
                  onChangeText={(text) => handleInputChange('dtNascimento', text)}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  editable={!perfil?.dt_nascimento}
                />
                {erros.dtNascimento && <Text style={styles.erroTexto}>{erros.dtNascimento}</Text>}
                {perfil?.dt_nascimento && (
                  <Text style={styles.infoTexto}>Data de nascimento não pode ser alterada após o cadastro</Text>
                )}
              </View>

              <TouchableOpacity style={styles.salvarBtn} onPress={salvarPerfil}>
                <Text style={styles.salvarTexto}>Salvar Alterações</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Alterar Senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAlterarSenha}
        onRequestClose={() => setModalAlterarSenha(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Alterar Senha</Text>
              <TouchableOpacity onPress={() => setModalAlterarSenha(false)}>
                <Ionicons name="close" size={24} color="#4e5264" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha Atual *</Text>
                <TextInput
                  style={styles.input}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  placeholder="Digite sua senha atual"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nova Senha *</Text>
                <TextInput
                  style={styles.input}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  placeholder="Digite a nova senha"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirmar Nova Senha *</Text>
                <TextInput
                  style={styles.input}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  placeholder="Confirme a nova senha"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.salvarBtn} onPress={salvarSenha}>
                <Text style={styles.salvarTexto}>Alterar Senha</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Adicionar Endereço */}
        <ModalEndereco
          visible={modalEnderecoVisible}
          onClose={() => setModalEnderecoVisible(false)}
          clienteId={usuario?.id} 
          token={token}
          onEnderecoCadastrado={handleEnderecoCadastrado}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
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
  atualizarBtn: {
    padding: 6,
  },
  content: {
    flex: 1,
  },
  secao: {
    backgroundColor: "#ffffff",
    marginBottom: 8,
    padding: 16,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a112e",
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: "#4e5264",
    marginLeft: 8,
    marginRight: 8,
    width: 120,
  },
  infoValor: {
    fontSize: 14,
    color: "#0a112e",
    flex: 1,
  },
  campoBloqueado: {
    fontSize: 12,
    color: "#6c757d",
    fontStyle: 'italic',
  },
  alterarSenhaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  alterarSenhaTexto: {
    color: "#283579",
    fontSize: 14,
    fontWeight: "500",
  },
  enderecoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  enderecoTitulo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  principalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#f5a522",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    gap: 4,
  },
  principalTexto: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
  },
  enderecoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0a112e",
    flex: 1,
  },
  enderecoAcoes: {
    flexDirection: 'row',
    gap: 8,
  },
  acaoBtn: {
    padding: 4,
  },
  enderecoInfo: {
    marginTop: 4,
  },
  enderecoTexto: {
    fontSize: 14,
    color: "#4e5264",
    marginBottom: 2,
  },
  vazioContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  vazioTexto: {
    fontSize: 16,
    color: "#4e5264",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  novoEnderecoBtn: {
    backgroundColor: "#f5a522",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  novoEnderecoTexto: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc3545",
    gap: 8,
  },
  logoutTexto: {
    color: "#dc3545",
    fontSize: 14,
    fontWeight: "500",
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
  modalBody: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4e5264',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputDisabled: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  erroTexto: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  infoTexto: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  salvarBtn: {
    backgroundColor: "#283579",
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  salvarTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PerfilCliente;