
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InputCampo from '../components/InputCampo';
import SelectCampo from '../components/SelectCampo';
import RadioGrupo from '../components/RadioGrupo';
import Botao from '../components/Botao';
import { listarTiposServicos } from '../services/tiposServicos';
import { listarEnderecos } from '../services/enderecos';
import { criarSolicitacao, enviarImagemSolicitacao } from '../services/solicitacoes';

export default function NovaSolicitacaoScreen({ route, navigation }) {
  const cliente_id = route.params?.cliente_id || 1;

  const [tiposServicos, setTiposServicos] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [tipoServicoId, setTipoServicoId] = useState('');
  const [enderecoId, setEnderecoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState('');
  const [urgencia, setUrgencia] = useState('normal');
  const [imagem, setImagem] = useState(null);
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      const tipos = await listarTiposServicos();
      if (tipos.sucesso) setTiposServicos(tipos.tipos_servico);

      const end = await listarEnderecos(cliente_id);
      if (end.sucesso) setEnderecos(end.enderecos);
    }
    carregarDados();
  }, []);

  const selecionarImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0]);
    }
  };

  const gerarResumo = () => {
    if (!tipoServicoId || !enderecoId || !titulo || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const tipoNome = tiposServicos.find(t => t.id === tipoServicoId)?.nome || '';
    const endereco = enderecos.find(e => e.id === enderecoId);
    const enderecoTexto = endereco ? `${endereco.logradouro}, ${endereco.numero}` : '';

    setResumo({
      tipoNome,
      enderecoTexto,
      titulo,
      descricao,
      orcamento,
      dataAtendimento,
      urgencia,
      imagem,
    });
  };

  const publicarSolicitacao = async () => {
    const dados = {
      cliente_id,
      tipo_servico_id: tipoServicoId,
      endereco_id: enderecoId,
      titulo,
      descricao,
      orcamento_estimado: orcamento,
      data_atendimento: dataAtendimento,
      urgencia,
    };

    const resultado = await criarSolicitacao(dados);
    if (resultado.sucesso) {
      const solicitacao_id = resultado.solicitacao_id;
      if (imagem?.uri) {
        await enviarImagemSolicitacao(solicitacao_id, imagem.uri);
      }
      Alert.alert('Sucesso', 'Solicitação publicada com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', resultado.erro || 'Erro ao publicar solicitação.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Nova Solicitação</Text>
      <InputCampo label="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex: Instalação elétrica" />
      <InputCampo label="Descrição" value={descricao} onChangeText={setDescricao} placeholder="Detalhes do serviço" />

      <SelectCampo
        label="Tipo de Serviço"
        selectedValue={tipoServicoId}
        onValueChange={setTipoServicoId}
        options={tiposServicos}
      />

      <SelectCampo
        label="Endereço"
        selectedValue={enderecoId}
        onValueChange={setEnderecoId}
        options={enderecos}
      />
      
      <InputCampo label="Orçamento Estimado" value={orcamento} onChangeText={setOrcamento} placeholder="Ex: 150.00" />
      <InputCampo label="Data de Atendimento" value={dataAtendimento} onChangeText={setDataAtendimento} placeholder="YYYY-MM-DD" />

      <RadioGrupo
        label="Urgência"
        options={['normal', 'media', 'urgente']}
        selected={urgencia}
        onSelect={setUrgencia}
      />

      <Botao title="Selecionar Imagem" onPress={selecionarImagem} variante="outline" />
      {imagem?.uri && <Image source={{ uri: imagem.uri }} style={styles.imagemPreview} />}

      <Botao title="Gerar Resumo" onPress={gerarResumo} variante="secundario" />
      {resumo && (
        <View style={styles.resumo}>
          <Text style={styles.resumoTitulo}>Resumo da Solicitação</Text>
          <Text>Tipo: {resumo.tipoNome}</Text>
          <Text>Endereço: {resumo.enderecoTexto}</Text>
          <Text>Título: {resumo.titulo}</Text>
          <Text>Descrição: {resumo.descricao}</Text>
          <Text>Orçamento: R$ {resumo.orcamento}</Text>
          <Text>Data: {resumo.dataAtendimento}</Text>
          <Text>Urgência: {resumo.urgencia}</Text>
        </View>
      )}

      <Botao title="Publicar Solicitação" onPress={publicarSolicitacao} variante="primario" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a112e',
    marginBottom: 16,
  },
  imagemPreview: {
    width: '100%',
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  resumo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  resumoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0a112e',
  },
});
