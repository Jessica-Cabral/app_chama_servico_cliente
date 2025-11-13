import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import InputCampo from "../components/InputCampo";
import SelectCampo from "../components/SelectCampo";
import RadioGrupo from "../components/RadioGrupo";
import Botao from "../components/Botao";
import SecaoFormulario from "../components/SecaoFormulario";
import ModalEndereco from "../components/ModalEndereco";

import { listarTiposServicos } from "../services/tiposServicos";
import { listarEnderecos } from "../services/enderecos";
import {
  criarSolicitacao,
  atualizarSolicitacao,
  enviarImagemSolicitacao,
  buscarSolicitacaoPorId,
} from "../services/solicitacoes";

export default function NovaSolicitacao({ route, navigation }) {
  const { token, usuario } = useContext(AuthContext);

  if (!usuario) {
    return <Text>Usuário não autenticado</Text>;
  }

  const cliente_id = usuario.id;
  const solicitacao = route.params?.solicitacao ?? null;

  const [tiposServicos, setTiposServicos] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [tipoServicoId, setTipoServicoId] = useState(
    solicitacao?.tipo_servico_id ?? ""
  );
  const [enderecoId, setEnderecoId] = useState(solicitacao?.endereco_id ?? "");
  const [titulo, setTitulo] = useState(solicitacao?.titulo ?? "");
  const [descricao, setDescricao] = useState(solicitacao?.descricao ?? "");
  const [orcamento, setOrcamento] = useState(
    solicitacao?.orcamento_estimado?.toString() ?? ""
  );
  const [urgencia, setUrgencia] = useState(solicitacao?.urgencia ?? "media");
  const [imagens, setImagens] = useState([]);
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [carregandoImagens, setCarregandoImagens] = useState(false);

  // Estados para data/hora
  const [dataAtendimento, setDataAtendimento] = useState(
    solicitacao?.data_atendimento
      ? new Date(solicitacao.data_atendimento)
      : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estado para o modal de endereço
  const [modalEnderecoVisivel, setModalEnderecoVisivel] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const tipos = await listarTiposServicos(token);
        if (tipos.sucesso) {
          setTiposServicos(tipos.tipos_servico || []);
        }

        await carregarEnderecos();

        // Se estiver editando, carregar imagens existentes
        if (solicitacao?.id) {
          await carregarImagensSolicitacao();
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados necessários");
      }
    }
    carregarDados();
  }, [cliente_id, token, solicitacao]);

  const carregarImagensSolicitacao = async () => {
    if (!solicitacao?.id) return;

    try {
      setCarregandoImagens(true);
      const resultado = await buscarSolicitacaoPorId(solicitacao.id, token);

      if (resultado.sucesso && resultado.solicitacao.imagens) {
        const imagensFormatadas = resultado.solicitacao.imagens.map((img) => ({
          id: img.id,
          uri: `https://chamaservico.tds104-senac.online/uploads/solicitacoes/${img.caminho_imagem}`,
          tipo: "existente",
        }));
        setImagensExistentes(imagensFormatadas);
      }
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    } finally {
      setCarregandoImagens(false);
    }
  };

  const carregarEnderecos = async () => {
    try {
      const end = await listarEnderecos(cliente_id, token);
      if (end.sucesso && Array.isArray(end.enderecos)) {
        const enderecosFormatados = end.enderecos.map((e) => ({
          id: e.id,
          nome: `${e.logradouro}, ${e.numero} - ${e.bairro}`,
        }));
        setEnderecos(enderecosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    }
  };

  
  const handleEnderecoCadastrado = (novoEnderecoId) => {
    if (novoEnderecoId) {
      setEnderecoId(novoEnderecoId);
    }
    carregarEnderecos();
  };



  // Funções para data/hora
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataAtendimento(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(dataAtendimento);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDataAtendimento(newDateTime);
    }
  };

  const formatarDataHora = (date) => {
    if (!date) return "";
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validarCamposObrigatorios = () => {
    const novosErros = {};
    if (!titulo.trim()) novosErros.titulo = "Título é obrigatório.";
    if (!descricao.trim()) novosErros.descricao = "Descrição é obrigatória.";
    if (!tipoServicoId)
      novosErros.tipoServicoId = "Selecione um tipo de serviço.";
    if (!enderecoId) novosErros.enderecoId = "Selecione um endereço.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const selecionarImagens = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para selecionar imagens."
        );
        return;
      }

      const totalImagens = imagens.length + imagensExistentes.length;
      const selectionLimit = 5 - totalImagens;

      if (selectionLimit <= 0) {
        Alert.alert(
          "Limite atingido",
          "Você pode adicionar no máximo 5 imagens por solicitação."
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
        selectionLimit: selectionLimit,
      });

      if (!resultado.canceled && resultado.assets) {
        const novasImagens = resultado.assets.map((asset) => ({
          ...asset,
          tipo: "nova",
        }));
        setImagens((prev) => [...prev, ...novasImagens]);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagens:", error);
      Alert.alert("Erro", "Não foi possível selecionar as imagens");
    }
  };

  const removerImagem = (index, tipo) => {
    if (tipo === "existente") {
      setImagensExistentes((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImagens((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removerImagemExistente = async (imagemId, index) => {
    try {
      Alert.alert("Remover Imagem", "Deseja remover esta imagem?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setImagensExistentes((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      Alert.alert("Erro", "Não foi possível remover a imagem");
    }
  };

  const gerarResumo = () => {
    if (!validarCamposObrigatorios()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }
    const tipoNome =
      tiposServicos.find((t) => t.id === tipoServicoId)?.nome ?? "";
    const endereco = enderecos.find((e) => e.id === enderecoId);
    const enderecoTexto = endereco ? endereco.nome : "";
    setResumo({
      tipoNome,
      enderecoTexto,
      titulo,
      descricao,
      orcamento,
      dataAtendimento: formatarDataHora(dataAtendimento),
      urgencia,
      imagens: [...imagensExistentes, ...imagens],
      totalImagens: imagensExistentes.length + imagens.length,
    });
  };

  const limparFormulario = () => {
    setTipoServicoId("");
    setEnderecoId("");
    setTitulo("");
    setDescricao("");
    setOrcamento("");
    setDataAtendimento(new Date());
    setUrgencia("media");
    setImagens([]);
    setImagensExistentes([]);
    setResumo(null);
    setErros({});
  };

  const salvarSolicitacao = async () => {
    if (!validarCamposObrigatorios()) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos obrigatórios antes de publicar."
      );
      return;
    }

    setCarregando(true);
    //console.log(' Rotas disponíveis no navigation:', navigation.getState()?.routes?.map(r => r.name));
    try {
      const dados = {
        cliente_id,
        titulo,
        descricao,
        tipo_servico_id: tipoServicoId,
        endereco_id: enderecoId,
        urgencia,
        orcamento_estimado: orcamento ? parseFloat(orcamento) : 0,
        data_atendimento: dataAtendimento
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      };
      // Para teste
      // console.log("Enviando dados:", dados);
      // console.log("Editando solicitação?", !!solicitacao?.id);
      // console.log("ID da solicitação:", solicitacao?.id);

      let resultado;
      if (solicitacao?.id) {
        // Para edição - inclui o ID da solicitação
        dados.solicitacao_id = solicitacao.id;
        resultado = await atualizarSolicitacao(solicitacao.id, dados, token);
      } else {
        // Para criação nova
        resultado = await criarSolicitacao(dados, token);
      }

      console.log("Resposta da API:", resultado);

      if (resultado.sucesso) {
        const solicitacao_id = resultado.solicitacao_id || solicitacao?.id;

        // Enviar novas imagens, se houver
        if (imagens.length > 0 && solicitacao_id) {
          for (const img of imagens) {
            if (img.uri && img.tipo === "nova") {
              await enviarImagemSolicitacao(solicitacao_id, img.uri, token);
            }
          }
        }

        Alert.alert(
          "Sucesso",
          solicitacao
            ? "Solicitação atualizada com sucesso!"
            : "Solicitação publicada com sucesso!",
          [
            {
              text: "OK",
              onPress: () => {
                limparFormulario();
                navigation.popToTop();
              },
            },
          ]
        );
      } else {
        Alert.alert("Erro", resultado.erro || "Erro ao salvar solicitação.");
      }
    } catch (error) {
      console.error("Erro ao salvar solicitação:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LinearGradient colors={["#283579", "#0a112e"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>
          {solicitacao ? "Editar Solicitação" : "Nova Solicitação"}
        </Text>

        <SecaoFormulario titulo="Informações do Serviço">
          <SelectCampo
            label="Tipo de Serviço *"
            selectedValue={tipoServicoId}
            onValueChange={(value) => {
              setTipoServicoId(value);
              if (erros.tipoServicoId)
                setErros((prev) => ({ ...prev, tipoServicoId: null }));
            }}
            options={tiposServicos}
            placeholder="Selecione o tipo de serviço"
            erro={erros.tipoServicoId}
          />
          <InputCampo
            label="Título *"
            value={titulo}
            onChangeText={(text) => {
              setTitulo(text);
              if (erros.titulo) setErros((prev) => ({ ...prev, titulo: null }));
            }}
            placeholder="Ex: Instalação elétrica"
            erro={erros.titulo}
          />
          <InputCampo
            label="Descrição *"
            value={descricao}
            onChangeText={(text) => {
              setDescricao(text);
              if (erros.descricao)
                setErros((prev) => ({ ...prev, descricao: null }));
            }}
            placeholder="Detalhes do serviço necessário"
            multiline={true}
            numberOfLines={4}
            erro={erros.descricao}
          />
          
        </SecaoFormulario>

        <SecaoFormulario titulo="Endereço do serviço">
          <SelectCampo
            label="Endereço *"
            selectedValue={enderecoId}
            onValueChange={(value) => {
              setEnderecoId(value);
              if (erros.enderecoId)
                setErros((prev) => ({ ...prev, enderecoId: null }));
            }}
            options={enderecos}
            placeholder="Selecione um endereço"
            erro={erros.enderecoId}
          />
          <Botao
            title="Adicionar Novo Endereço"
            variante="outline"
            onPress={() => setModalEnderecoVisivel(true)}
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

          {/* Data e Hora com DateTimePicker */}
          <View style={styles.dataHoraContainer}>
            <Text style={styles.dataHoraLabel}>Data e Hora de Atendimento</Text>
            <View style={styles.dataHoraBotoes}>
              <TouchableOpacity
                style={styles.dataHoraBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#283579" />
                <Text style={styles.dataHoraBtnText}>
                  {dataAtendimento.toLocaleDateString("pt-BR")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dataHoraBtn}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#283579" />
                <Text style={styles.dataHoraBtnText}>
                  {dataAtendimento.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dataAtendimento}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={dataAtendimento}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>

          <RadioGrupo
            label="Urgência"
            options={[
              { label: "Baixa", value: "baixa" },
              { label: "Média", value: "media" },
              { label: "Alta", value: "alta" },
            ]}
            selected={urgencia}
            onSelect={setUrgencia}
          />
        </SecaoFormulario>

        <SecaoFormulario titulo="Imagens">
          <Botao
            title="Selecionar Novas Imagens"
            onPress={selecionarImagens}
            variante="outline"
          />

          {/* Imagens Existentes */}
          {imagensExistentes.length > 0 && (
            <View style={styles.imagensContainer}>
              <Text style={styles.imagensTitulo}>
                Imagens existentes ({imagensExistentes.length})
              </Text>
              <ScrollView horizontal style={styles.imagemPreviewContainer}>
                {imagensExistentes.map((img, index) => (
                  <View key={`existente-${img.id}`} style={styles.imagemItem}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.imagemPreview}
                    />
                    <TouchableOpacity
                      style={styles.removerImagemBtn}
                      onPress={() => removerImagemExistente(img.id, index)}
                    >
                      <Text style={styles.removerImagemTexto}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Novas Imagens */}
          {imagens.length > 0 && (
            <View style={styles.imagensContainer}>
              <Text style={styles.imagensTitulo}>
                Novas imagens selecionadas ({imagens.length})
              </Text>
              <ScrollView horizontal style={styles.imagemPreviewContainer}>
                {imagens.map((img, index) => (
                  <View key={`nova-${index}`} style={styles.imagemItem}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.imagemPreview}
                    />
                    <TouchableOpacity
                      style={styles.removerImagemBtn}
                      onPress={() => removerImagem(index, "nova")}
                    >
                      <Text style={styles.removerImagemTexto}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {imagensExistentes.length === 0 && imagens.length === 0 && (
            <Text style={styles.semImagensTexto}>
              Nenhuma imagem selecionada. Você pode adicionar até 5 imagens.
            </Text>
          )}

          {carregandoImagens && (
            <Text style={styles.carregandoTexto}>Carregando imagens...</Text>
          )}

          <Text style={styles.infoImagens}>
            Total: {imagensExistentes.length + imagens.length}/5 imagens
          </Text>
        </SecaoFormulario>

        <Botao
          title="Gerar Resumo"
          onPress={gerarResumo}
          variante="secundario"
        />

        {resumo && (
          <SecaoFormulario titulo="Resumo da Solicitação">
            <Text style={styles.resumoTexto}>Tipo: {resumo.tipoNome}</Text>
            <Text style={styles.resumoTexto}>
              Endereço: {resumo.enderecoTexto}
            </Text>
            <Text style={styles.resumoTexto}>Título: {resumo.titulo}</Text>
            <Text style={styles.resumoTexto}>
              Descrição: {resumo.descricao}
            </Text>
            <Text style={styles.resumoTexto}>
              Orçamento: R$ {resumo.orcamento || "0,00"}
            </Text>
            <Text style={styles.resumoTexto}>
              Data: {resumo.dataAtendimento}
            </Text>
            <Text style={styles.resumoTexto}>Urgência: {resumo.urgencia}</Text>
            <Text style={styles.resumoTexto}>
              Imagens: {resumo.totalImagens}
            </Text>
          </SecaoFormulario>
        )}

        <Botao
          title={solicitacao ? "Salvar Alterações" : "Publicar Solicitação"}
          onPress={salvarSolicitacao}
          variante="primario"
          carregando={carregando}
        />
      </ScrollView>

      <ModalEndereco
        visible={modalEnderecoVisivel}
        onClose={() => setModalEnderecoVisivel(false)}
        clienteId={cliente_id}
        token={token}
        onEnderecoCadastrado={handleEnderecoCadastrado}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  imagensContainer: {
    marginTop: 16,
  },
  imagensTitulo: {
    color: "#ffffff",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  imagemPreviewContainer: {
    marginVertical: 8,
  },
  imagemItem: {
    position: "relative",
    marginRight: 12,
  },
  imagemPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removerImagemBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#dc3545",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removerImagemTexto: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resumoTexto: {
    color: "#283579",
    marginBottom: 6,
    fontSize: 14,
  },
  dataHoraContainer: {
    marginBottom: 16,
  },
  dataHoraLabel: {
    color: "#283579",
    marginBottom: 8,
    fontWeight: "bold",
  },
  dataHoraBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dataHoraBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dataHoraBtnText: {
    color: "#283579",
    fontSize: 14,
    fontWeight: "500",
  },
  carregandoTexto: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  semImagensTexto: {
    color: "#cccccc",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  infoImagens: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
  },
  enderecoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  enderecoLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  recarregarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  recarregarTexto: {
    color: "#283579",
    fontSize: 12,
    fontWeight: "500",
  },
});
