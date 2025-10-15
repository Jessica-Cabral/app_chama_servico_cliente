import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { consultarPerfil, atualizarPerfil } from '../services/perfil';
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
    async function carregarPerfil() {
      if (!usuario?.id) return;
      const response = await consultarPerfil(usuario.id, token);
      if (response.sucesso) {
        setPerfil(response.perfil);
        setEnderecos(response.enderecos);
      } else {
        Alert.alert('Erro', response.erro || 'Não foi possível carregar o perfil');
      }
    }
    carregarPerfil();
  }, [usuario]);

  const handleSalvar = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
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
      } else {
        Alert.alert('Erro', response.erro || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao atualizar perfil');
      console.error(error);
    }
  };
  
  const definirComoPrincipal = async (enderecoId) => {
    const response = await definirEnderecoPrincipal(usuario.id, enderecoId, token);
    if (response.sucesso) {
      Alert.alert('Sucesso', 'Endereço definido como principal');
      const atualizado = await consultarPerfil(usuario.id, token);
      if (atualizado.sucesso) {
        setPerfil(atualizado.perfil);
        setEnderecos(atualizado.enderecos);
      }
    } else {
      Alert.alert('Erro', response.erro || 'Não foi possível atualizar o endereço principal');
    }
  };


  return (
    <LinearGradient colors={['#283579', '#283579']} style={styles.container}>
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
          <InputCampo label="Endereços" value="" editable={false} />
          {enderecos.map((endereco) => (
            <EnderecoCard key={endereco.id} endereco={endereco} />
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