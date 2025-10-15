import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, Alert } from 'react-native';
//import * as ImagePicker from 'expo-image-picker';
import clienteApi from '../services/clienteApi';
import EnderecoCard from '../components/EnderecoCard';
import FotoPerfilUploader from '../components/FotoPerfilUploader';

export default function PerfilCliente() {
  const [perfil, setPerfil] = useState({});
  const [enderecos, setEnderecos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    async function carregarPerfil() {
      const clienteId = 1; // Exemplo
      const response = await clienteApi.buscarPerfil(clienteId);
      if (response.sucesso) {
        setPerfil(response.perfil);
        setEnderecos(response.enderecos);
      }
    }
    carregarPerfil();
  }, []);

  const handleSalvar = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Chamada para atualizar perfil (a ser implementada na API)
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    setEditando(false);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <FotoPerfilUploader fotoAtual={perfil.foto_perfil} />
      
      <Text>Nome completo *</Text>
      <TextInput value={perfil.nome} editable={editando} onChangeText={(text) => setPerfil({ ...perfil, nome: text })} />

      <Text>Email *</Text>
      <TextInput value={perfil.email} editable={editando} onChangeText={(text) => setPerfil({ ...perfil, email: text })} />

      <Text>Telefone *</Text>
      <TextInput value={perfil.telefone} editable={editando} onChangeText={(text) => setPerfil({ ...perfil, telefone: text })} />

      <Text>CPF (não editável)</Text>
      <TextInput value={perfil.cpf} editable={false} />

      <Text>Data de nascimento (não editável)</Text>
      <TextInput value={perfil.dt_nascimento} editable={false} />

      {editando && (
        <>
          <Text>Nova senha</Text>
          <TextInput secureTextEntry value={novaSenha} onChangeText={setNovaSenha} />

          <Text>Confirmar nova senha</Text>
          <TextInput secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />
        </>
      )}

      <Button title={editando ? 'Salvar alterações' : 'Editar perfil'} onPress={() => editando ? handleSalvar() : setEditando(true)} />
      {editando && <Button title="Cancelar" onPress={() => setEditando(false)} color="#EF4444" />}

      <Text style={{ marginTop: 24, fontSize: 18 }}>Endereços</Text>
      {enderecos.map((endereco) => (
        <EnderecoCard key={endereco.id} endereco={endereco} />
      ))}
    </ScrollView>
  );
}