import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { consultarPerfil, atualizarPerfil } from '../services/perfil';
import {
  listarEnderecos,
  definirEnderecoPrincipal,
  excluirEndereco
} from '../services/enderecos';
import EnderecoCard from '../components/EnderecoCard';
import FotoPerfilUploader from '../components/FotoPerfilUploader';
import InputCampo from '../components/InputCampo';
import Botao from '../components/Botao';

export default function PerfilCliente() {
  const { usuario, token } = useContext(AuthContext);
  const [perfil, setPerfil] = useState({});
  const [enderecos, setEnderecos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    if (usuario?.id && token) {
      carregarDados();
    }
  }, [usuario, token]);

  const carregarDados = async () => {
    const perfilResponse = await consultarPerfil(usuario.id, token);
    const enderecosResponse = await listarEnderecos(usuario.id, token);

    if (perfilResponse.sucesso) {
      setPerfil(perfilResponse.perfil);
    } else {
      Alert.alert('Erro', perfilResponse.erro || 'Não foi possível carregar o perfil');
    }

    if (enderecosResponse.sucesso) {
      setEnderecos(enderecosResponse.enderecos);
    } else {
      Alert.alert('Erro', enderecosResponse.erro || 'Não foi possível carregar os endereços');
    }
  };

  const handleSalvar = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    const response = await atualizarPerfil(
      usuario.id,
      perfil.nome,
      perfil.email,
      perfil.telefone,
      perfil.cpf,
      perfil.dt_nascimento,
      token
    );

    if (response.sucesso) {
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setEditando(false);
      carregarDados();
    } else {
      Alert.alert('Erro', response.erro || 'Erro ao atualizar perfil');
    }
  };

  const handleDefinirPrincipal = async (enderecoId) => {
    const response = await definirEnderecoPrincipal(usuario.id, enderecoId,token);
    if (response.sucesso) {
      Alert.alert('Sucesso', 'Endereço definido como principal');
      carregarDados();
    } else {
      Alert.alert('Erro', response.erro || 'Não foi possível atualizar');
    }
  };

  const handleExcluirEndereco = async (enderecoId) => {
    const response = await excluirEndereco(usuario.id, enderecoId,token);
    if (response.sucesso) {
      Alert.alert('Sucesso', 'Endereço excluído com sucesso');
      carregarDados();
    } else {
      Alert.alert('Erro', response.erro || 'Não foi possível excluir');
    }
  };

  return (
    <LinearGradient colors={['#0a112e', '#283579']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <FotoPerfilUploader fotoAtual={perfil.foto_perfil} />

          <InputCampo
            label="Nome completo *"
            value={perfil.nome}
            editable={editando}
            onChangeText={(text) => setPerfil({ ...perfil, nome: text })}
            placeholder="Digite seu nome"
          />

          <InputCampo
            label="Email *"
            value={perfil.email}
            editable={editando}
            onChangeText={(text) => setPerfil({ ...perfil, email: text })}
            placeholder="Digite seu email"
            keyboardType="email-address"
          />

          <InputCampo
            label="Telefone *"
            value={perfil.telefone}
            editable={editando}
            onChangeText={(text) => setPerfil({ ...perfil, telefone: text })}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
          />

          <InputCampo
            label="CPF"
            value={perfil.cpf}
            editable={false}
          />

          <InputCampo
            label="Data de nascimento"
            value={perfil.dt_nascimento}
            editable={false}
            tipo="datetime"
          />

          {editando && (
            <>
              <InputCampo
                label="Nova senha"
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Digite a nova senha"
                secureTextEntry
              />
              <InputCampo
                label="Confirmar nova senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Confirme a nova senha"
                secureTextEntry
              />
            </>
          )}

          <Botao
            title={editando ? 'Salvar alterações' : 'Editar perfil'}
            onPress={() => (editando ? handleSalvar() : setEditando(true))}
            variante="primario"
          />

          {editando && (
            <Botao
              title="Cancelar"
              onPress={() => setEditando(false)}
              variante="secundario"
            />
          )}
        </View>

        <View style={styles.enderecos}>
          <InputCampo style={styles.inputEndereco} label="Meus Endereços" value="" editable={false} />
          {enderecos.map((endereco) => (
            <EnderecoCard
              key={endereco.id}
              endereco={endereco}
              onDefinirPrincipal={handleDefinirPrincipal}
              onExcluir={handleExcluirEndereco}
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#4e5264',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  enderecos: {
    marginTop: 24,
  },
 
  
});