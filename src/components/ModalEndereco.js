//Modal com formulário de novo endereço
// foi utilizada nas telas NovaSolicitação e MeuPerfil

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import InputCampo from './InputCampo';
import Botao from './Botao';
import { cadastrarEndereco, buscarEnderecoPorCEP } from '../services/enderecos';

export default function ModalEndereco({ 
  visible, 
  onClose, 
  clienteId, 
  token, 
  onEnderecoCadastrado 
}) {
  const [carregandoCEP, setCarregandoCEP] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    principal: false
  });
  const [errosEndereco, setErrosEndereco] = useState({});
  const timeoutRef = useRef(null);

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const buscarCEP = async (cep) => {
    if (!cep || cep.length !== 8) {
      setErrosEndereco(prev => ({ ...prev, cep: 'CEP deve ter 8 dígitos' }));
      return;
    }

    setCarregandoCEP(true);
    setErrosEndereco(prev => ({ ...prev, cep: null }));

    try {
      const resultado = await buscarEnderecoPorCEP(cep);
      
      if (resultado.sucesso) {
        setNovoEndereco(prev => ({
          ...prev,
          logradouro: resultado.endereco.logradouro,
          bairro: resultado.endereco.bairro,
          cidade: resultado.endereco.cidade,
          estado: resultado.endereco.estado,
          complemento: resultado.endereco.complemento || ''
        }));
      } else {
        setErrosEndereco(prev => ({ ...prev, cep: resultado.erro }));
      }
    } catch (error) {
      setErrosEndereco(prev => ({ ...prev, cep: 'Erro ao buscar CEP' }));
    } finally {
      setCarregandoCEP(false);
    }
  };

  const formatarCEP = (text) => {
    const numbers = text.replace(/\D/g, '');
    
    if (numbers.length <= 5) {
      return numbers;
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    }
  };

  const handleCEPMudanca = (text) => {
    const cepFormatado = formatarCEP(text);
    setNovoEndereco(prev => ({ ...prev, cep: cepFormatado }));
    setErrosEndereco(prev => ({ ...prev, cep: null }));
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const cepNumerico = cepFormatado.replace(/\D/g, '');
    if (cepNumerico.length === 8) {
      timeoutRef.current = setTimeout(() => {
        buscarCEP(cepNumerico);
      }, 1000);
    }
  };

  const validarEndereco = () => {
    const novosErros = {};
    
    if (!novoEndereco.cep.trim()) novosErros.cep = 'CEP é obrigatório';
    if (!novoEndereco.logradouro.trim()) novosErros.logradouro = 'Logradouro é obrigatório';
    if (!novoEndereco.numero.trim()) novosErros.numero = 'Número é obrigatório';
    if (!novoEndereco.bairro.trim()) novosErros.bairro = 'Bairro é obrigatório';
    if (!novoEndereco.cidade.trim()) novosErros.cidade = 'Cidade é obrigatória';
    if (!novoEndereco.estado.trim()) novosErros.estado = 'Estado é obrigatório';

    setErrosEndereco(novosErros);
    return Object.keys(novosErros).length === 0;
  };


  const salvarNovoEndereco = async () => {
    if (!validarEndereco()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios do endereço');
      return;
    }
    // // DEBUG para verificar se os dados chegam corretamente
    // console.log('=== DEBUG MODAL ENDERECO ===');
    // console.log('clienteId recebido:', clienteId);
    // console.log('clienteId tipo:', typeof clienteId);
    // console.log('token recebido:', token ? 'PRESENTE' : 'AUSENTE');
    // console.log('token valor:', token);
    // console.log('dados endereço:', novoEndereco);
    // console.log('============================');

  if (!clienteId) {
    Alert.alert('Erro', 'ID do cliente não encontrado');
    return;
  }

  if (!token) {
    Alert.alert('Erro', 'Token de autenticação não encontrado');
    return;
  }

  try {
    const dadosEndereco = {
      cliente_id: clienteId,
      cep: novoEndereco.cep.replace(/\D/g, ''),
      logradouro: novoEndereco.logradouro,
      numero: novoEndereco.numero,
      complemento: novoEndereco.complemento,
      bairro: novoEndereco.bairro,
      cidade: novoEndereco.cidade,
      estado: novoEndereco.estado,
      //Não é obrigatório
      //principal: novoEndereco.principal
    };

    console.log('Dados enviados para API:', dadosEndereco);

    const resultado = await cadastrarEndereco(dadosEndereco, token);

    console.log('Resposta da API:', resultado);

    if (resultado.sucesso) {
      Alert.alert('Sucesso', 'Endereço cadastrado com sucesso!');
      onEnderecoCadastrado(resultado.endereco_id);
      limparFormulario();
      onClose();
    } else {
      Alert.alert('Erro', resultado.erro || 'Erro ao cadastrar endereço');
    }
  } catch (error) {
    console.error('Erro completo:', error);
    Alert.alert('Erro', 'Erro ao conectar com o servidor');
  }
  };
  const limparFormulario = () => {
    setNovoEndereco({
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      principal: false
    });
    setErrosEndereco({});
  };

  const handleFechar = () => {
    limparFormulario();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleFechar}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Novo Endereço</Text>
              <TouchableOpacity 
                onPress={handleFechar}
                style={styles.modalFecharBtn}
              >
                <Ionicons name="close" size={24} color="#4e5264" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.campoGrupo}>
                <InputCampo
                  label="CEP *"
                  value={novoEndereco.cep}
                  onChangeText={handleCEPMudanca}
                  placeholder="00000-000"
                  keyboardType="numeric"
                  maxLength={9}
                  erro={errosEndereco.cep}
                  iconeDireita={carregandoCEP ? "refresh" : "search"}
                  onIconPress={() => {
                    const cepNumerico = novoEndereco.cep.replace(/\D/g, '');
                    if (cepNumerico.length === 8) {
                      buscarCEP(cepNumerico);
                    }
                  }}
                />
              </View>

              <View style={styles.campoGrupo}>
                <InputCampo
                  label="Logradouro *"
                  value={novoEndereco.logradouro}
                  onChangeText={(text) => setNovoEndereco(prev => ({ ...prev, logradouro: text }))}
                  placeholder="Rua, Avenida, etc."
                  erro={errosEndereco.logradouro}
                />
              </View>

              <View style={styles.linhaCampos}>
                <View style={[styles.campoGrupo, { flex: 1, marginRight: 8 }]}>
                  <InputCampo
                    label="Número *"
                    value={novoEndereco.numero}
                    onChangeText={(text) => setNovoEndereco(prev => ({ ...prev, numero: text }))}
                    placeholder="123"
                    keyboardType="numeric"
                    erro={errosEndereco.numero}
                  />
                </View>
                <View style={[styles.campoGrupo, { flex: 2 }]}>
                  <InputCampo
                    label="Complemento"
                    value={novoEndereco.complemento}
                    onChangeText={(text) => setNovoEndereco(prev => ({ ...prev, complemento: text }))}
                    placeholder="Apto, Bloco, etc."
                  />
                </View>
              </View>

              <View style={styles.campoGrupo}>
                <InputCampo
                  label="Bairro *"
                  value={novoEndereco.bairro}
                  onChangeText={(text) => setNovoEndereco(prev => ({ ...prev, bairro: text }))}
                  placeholder="Bairro"
                  erro={errosEndereco.bairro}
                />
              </View>

              <View style={styles.linhaCampos}>
                <View style={[styles.campoGrupo, { flex: 3, marginRight: 8 }]}>
                  <InputCampo
                    label="Cidade *"
                    value={novoEndereco.cidade}
                    onChangeText={(text) => setNovoEndereco(prev => ({ ...prev, cidade: text }))}
                    placeholder="Cidade"
                    erro={errosEndereco.cidade}
                  />
                </View>
                <View style={[styles.campoGrupo, { flex: 1 }]}>
                  <InputCampo
                    label="UF *"
                    value={novoEndereco.estado}
                    onChangeText={(text) => setNovoEndereco(prev => ({ ...prev, estado: text.toUpperCase() }))}
                    placeholder="UF"
                    maxLength={2}
                    erro={errosEndereco.estado}
                  />
                </View>
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setNovoEndereco(prev => ({ ...prev, principal: !prev.principal }))}
                >
                  <View style={[
                    styles.checkboxSquare,
                    novoEndereco.principal && styles.checkboxSquareSelecionado
                  ]}>
                    {novoEndereco.principal && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Definir como endereço principal</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Botao
                title="Cancelar"
                onPress={handleFechar}
                variante="outline"
                style={styles.botaoModal}
              />
              <Botao
                title="Salvar"
                onPress={salvarNovoEndereco}
                variante="primario"
                style={styles.botaoModal}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
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
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  botaoModal: {
    flex: 1,
  },
  campoGrupo: {
    marginBottom: 16,
  },
  linhaCampos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#283579',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquareSelecionado: {
    backgroundColor: '#283579',
  },
  checkboxLabel: {
    color: '#0a112e',
    fontSize: 14,
  },
});
