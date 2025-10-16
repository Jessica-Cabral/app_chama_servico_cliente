import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

import InputCampo from '../components/InputCampo';
import SelectCampo from '../components/SelectCampo';
import RadioGrupo from '../components/RadioGrupo';
import Botao from '../components/Botao';
import SecaoFormulario from '../components/SecaoFormulario';

import { listarTiposServicos } from '../services/tiposServicos';
import { listarEnderecos } from '../services/enderecos';
import {
  criarSolicitacao,
  atualizarSolicitacao,
  enviarImagemSolicitacao,
} from '../services/solicitacoes';

export default function NovaSolicitacao1({ route, navigation }) {
  const { token } = useContext(AuthContext);
  //usar o usuário logado para vincular aos id_cliente da solicitação
  const { usuario, carregando } = useContext(AuthContext);
    if (carregando) {
      return <Text>Carregando...</Text>;
    }
    if (!usuario) {
      return <Text>Usuário não autenticado</Text>;
    }
  const cliente_id = usuario.id;
  const solicitacao = route.params?.solicitacao ?? null;

  const [tiposServicos, setTiposServicos] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [tipoServicoId, setTipoServicoId] = useState(solicitacao?.tipo_servico_id ?? '');
  const [enderecoId, setEnderecoId] = useState(solicitacao?.endereco_id ?? '');
  const [titulo, setTitulo] = useState(solicitacao?.titulo ?? '');
  const [descricao, setDescricao] = useState(solicitacao?.descricao ?? '');
  const [orcamento, setOrcamento] = useState(solicitacao?.orcamento_estimado ?? '');
  const [dataAtendimento, setDataAtendimento] = useState(solicitacao?.data_atendimento ?? '');
  const [urgencia, setUrgencia] = useState(solicitacao?.urgencia ?? 'baixa');
  const [imagens, setImagens] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [erros, setErros] = useState({});

  useEffect(() => {
    async function carregarDados() {
      const tipos = await listarTiposServicos(token);
      if (tipos.sucesso) setTiposServicos(tipos.tipos_servico);

      const end = await listarEnderecos(cliente_id, token);
      if (end.sucesso && Array.isArray(end.enderecos)) {
        const enderecosFormatados = end.enderecos.map((e) => ({
          id: e.id,
          nome: `${e.logradouro}, ${e.numero}`,
        }));
        setEnderecos(enderecosFormatados);
      }
    }
    carregarDados();
  }, []);

  const validarCamposObrigatorios = () => {
    const novosErros = {};
    if (!titulo.trim()) novosErros.titulo = "Título é obrigatório.";
    if (!descricao.trim()) novosErros.descricao = "Descrição é obrigatória.";
    if (!tipoServicoId) novosErros.tipoServicoId = "Selecione um tipo de serviço.";
    if (!enderecoId) novosErros.enderecoId = "Selecione um endereço.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const selecionarImagens = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!resultado.canceled) {
      setImagens(resultado.assets);
    }
  };

  const gerarResumo = () => {
    if (!validarCamposObrigatorios()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }
    const tipoNome = tiposServicos.find((t) => t.id === tipoServicoId)?.nome ?? '';
    const endereco = enderecos.find((e) => e.id === enderecoId);
    const enderecoTexto = endereco ? endereco.nome : '';
    setResumo({
      tipoNome,
      enderecoTexto,
      titulo,
      descricao,
      orcamento,
      dataAtendimento,
      urgencia,
      imagens,
    });
  };
  function converterParaFormatoAmericano(dataBr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
    const match = dataBr.match(regex);
    if (!match) return dataBr;
    const [, dia, mes, ano, hora, minuto] = match;
    return `${ano}-${mes}-${dia} ${hora}:${minuto}:00`;
  }
  const salvarSolicitacao = async () => {
    if (!validarCamposObrigatorios()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios antes de publicar.");
      return;
    }
    const dados = {
      cliente_id,
      titulo,
      descricao,
      tipo_servico_id: tipoServicoId,
      endereco_id: enderecoId,
      urgencia,
      orcamento_estimado: orcamento,
      data_atendimento: converterParaFormatoAmericano(dataAtendimento),
    };

    let resultado;
    if (solicitacao?.id) {
      resultado = await atualizarSolicitacao(solicitacao.id, dados);
    } else {
      resultado = await criarSolicitacao(dados,token);
      //console.log(dados,token)
    }

    if (resultado.sucesso) {
      const solicitacao_id = resultado.solicitacao_id ?? solicitacao.id;
      for (const img of imagens) {
        if (img.uri) {
          await enviarImagemSolicitacao(solicitacao_id, img.uri);
        }
      }
      Alert.alert("Sucesso", solicitacao ? "Solicitação atualizada!" : "Solicitação publicada!");
      navigation.navigate("MinhasSolicitacoes");
      // Limpar formulário
      setTipoServicoId('');
      setEnderecoId('');
      setTitulo('');
      setDescricao('');
      setOrcamento('');
      setDataAtendimento('');
      setUrgencia('baixa');
      setImagens([]);
      setResumo(null);
    } else {
      Alert.alert("Erro", resultado.erro ?? "Erro ao salvar solicitação.");
    }
  };

  return (
    <LinearGradient colors={["#283579", "#0a112e"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>
          {solicitacao ? "Editar Solicitação" : "Nova Solicitação"}
        </Text>

        <SecaoFormulario titulo="Informações do Serviço">
          <InputCampo
            label="Título"
            value={titulo}
            onChangeText={(text) => {
              setTitulo(text);
              if (erros.titulo) setErros((prev) => ({ ...prev, titulo: null }));
            }}
            placeholder="Ex: Instalação elétrica"
            erro={erros.titulo}
          />
          <InputCampo
            label="Descrição"
            value={descricao}
            onChangeText={(text) => {
              setDescricao(text);
              if (erros.descricao) setErros((prev) => ({ ...prev, descricao: null }));
            }}
            placeholder="Detalhes do serviço"
            erro={erros.descricao}
          />
          <SelectCampo
            label="Tipo de Serviço"
            selectedValue={tipoServicoId}
            onValueChange={(value) => {
              setTipoServicoId(value);
              if (erros.tipoServicoId) setErros((prev) => ({ ...prev, tipoServicoId: null }));
            }}
            options={tiposServicos}
            erro={erros.tipoServicoId}
          />
        </SecaoFormulario>

        <SecaoFormulario titulo="Endereço do serviço">
          <SelectCampo
            label="Endereço"
            selectedValue={enderecoId}
            onValueChange={(value) => {
              setEnderecoId(value);
              if (erros.enderecoId) setErros((prev) => ({ ...prev, enderecoId: null }));
            }}
            options={enderecos}
            erro={erros.enderecoId}
          />
          <Botao
            title="Adicionar Novo Endereço"
            variante="outline"
            onPress={() => navigation.navigate("PerfilCliente", { abrirModalEndereco: true })}
          />
        </SecaoFormulario>

        <SecaoFormulario titulo="Detalhes Adicionais">
          <InputCampo
            label="Orçamento Estimado"
            value={orcamento}
            onChangeText={setOrcamento}
            placeholder="Ex: 150.00"
            keyboardType="numeric"
          />
          <InputCampo
            label="Data de Atendimento"
            value={dataAtendimento}
            onChangeText={setDataAtendimento}
            placeholder="dd/mm/aaaa hh:mm"
            tipo="datetime"
            maxLength={16}
          />
          <RadioGrupo
            label="Urgência"
            options={["baixa", "media", "alta"]}
            selected={urgencia}
            onSelect={setUrgencia}
          />
        </SecaoFormulario>

        <SecaoFormulario titulo="Imagens">
          <Botao title="Selecionar Imagens" onPress={selecionarImagens} variante="outline" />
          {imagens.length > 0 && (
            <ScrollView horizontal style={styles.imagemPreviewContainer}>
              {imagens.map((img, index) => (
                <Image key={index} source={{ uri: img.uri }} style={styles.imagemPreview} />
              ))}
            </ScrollView>
          )}
        </SecaoFormulario>

        <Botao title="Gerar Resumo" onPress={gerarResumo} variante="secundario" />

        {resumo && (
          <SecaoFormulario titulo="Resumo da Solicitação">
            <Text style={styles.resumoTexto}>Tipo: {resumo.tipoNome}</Text>
            <Text style={styles.resumoTexto}>Endereço: {resumo.enderecoTexto}</Text>
            <Text style={styles.resumoTexto}>Título: {resumo.titulo}</Text>
            <Text style={styles.resumoTexto}>Descrição: {resumo.descricao}</Text>
            <Text style={styles.resumoTexto}>Orçamento: R$ {resumo.orcamento}</Text>
            <Text style={styles.resumoTexto}>Data: {resumo.dataAtendimento}</Text>
            <Text style={styles.resumoTexto}>Urgência: {resumo.urgencia}</Text>
          </SecaoFormulario>
        )}

        <Botao
          title={solicitacao ? "Salvar Alterações" : "Publicar Solicitação"}
          onPress={salvarSolicitacao}
          variante="primario"
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  imagemPreviewContainer: {
    marginVertical: 16,
  },
  imagemPreview: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  resumoTexto: {
    color: "#ffffff",
    marginBottom: 4,
  },
});