import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  Dimensions,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const MinhasSolicitacoes = () => {
  const { usuario, token } = useContext(AuthContext);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroUrgencia, setFiltroUrgencia] = useState("todos");
  const [buscaTexto, setBuscaTexto] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const buscarSolicitacoes = async () => {
      try {
        const response = await fetch(
          `https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/solicitacoes?cliente_id=${usuario.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.sucesso) {
          setSolicitacoes(data.solicitacoes);
        } else {
          console.error("Erro ao buscar solicitações:", data.erro);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (usuario && token) {
      buscarSolicitacoes();
    }
  }, [usuario, token]);

  const statusOpcoes = [
    { label: "Todos", value: "todos" },
    { label: "Pendente", value: "pendente" },
    { label: "Em andamento", value: "em_andamento" },
    { label: "Concluído", value: "concluido" },
    { label: "Cancelado", value: "cancelado" },
  ];

  const urgenciaOpcoes = ["todos", "baixa", "média", "alta"];

  const statusIcones = {
    pendente: { name: "time-outline", color: "#f5a522" },
    em_andamento: { name: "sync-outline", color: "#007bff" },
    concluido: { name: "checkmark-circle-outline", color: "#28a745" },
    cancelado: { name: "close-circle-outline", color: "#dc3545" },
  };

  const aplicarFiltros = () => {
    let filtradas = [...solicitacoes];

    if (filtroStatus !== "todos") {
      filtradas = filtradas.filter(
        (s) =>
          s.status_nome.toLowerCase().replace(" ", "_") === filtroStatus
      );
    }

    if (filtroUrgencia !== "todos") {
      filtradas = filtradas.filter(
        (s) => s.urgencia?.toLowerCase() === filtroUrgencia
      );
    }

    if (buscaTexto.trim() !== "") {
      const texto = buscaTexto.toLowerCase();
      filtradas = filtradas.filter(
        (s) =>
          s.titulo.toLowerCase().includes(texto) ||
          s.descricao.toLowerCase().includes(texto)
      );
    }

    return filtradas;
  };

  const renderItem = ({ item }) => {
    const statusKey = item.status_nome.toLowerCase().replace(" ", "_");
    const icone = statusIcones[statusKey] || {
      name: "help-circle-outline",
      color: "#999",
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="briefcase-outline" size={20} color="#f5a522" />
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
        </View>
        <Text style={styles.cardDescricao}>{item.descricao}</Text>
        <View style={styles.cardStatusLinha}>
          <Ionicons name={icone.name} size={16} color={icone.color} />
          <Text style={[styles.cardStatus, { color: icone.color }]}>
            Status: {item.status_nome}
          </Text>
        </View>
        <Text style={styles.cardData}>Data: {item.data_atendimento}</Text>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
          Carregando solicitações...
        </Animated.Text>
      </View>
    );
  }

  const solicitacoesFiltradas = aplicarFiltros();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Solicitações</Text>

      {/* Área de filtros */}
      <View style={styles.filtrosWrapper}>
        <Text style={styles.filtrosTitulo}>Filtros</Text>

        {/* Campo de busca */}
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por título ou descrição"
          placeholderTextColor="#999"
          value={buscaTexto}
          onChangeText={setBuscaTexto}
        />

        {/* Filtros de status */}
        <Text style={styles.subtitulo}>Status:</Text>
        <View style={styles.filtrosContainer}>
          {statusOpcoes.map((opcao) => (
            <TouchableOpacity
              key={opcao.value}
              onPress={() => setFiltroStatus(opcao.value)}
              style={[
                styles.filtroBotao,
                filtroStatus === opcao.value && styles.filtroBotaoAtivo,
              ]}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  filtroStatus === opcao.value && styles.filtroTextoAtivo,
                ]}
              >
                {opcao.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filtros de urgência
        <Text style={styles.subtitulo}>Urgência:</Text>
        <View style={styles.filtrosContainer}>
          {urgenciaOpcoes.map((nivel) => (
            <TouchableOpacity
              key={nivel}
              onPress={() => setFiltroUrgencia(nivel)}
              style={[
                styles.filtroBotao,
                filtroUrgencia === nivel && styles.filtroBotaoAtivo,
              ]}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  filtroUrgencia === nivel && styles.filtroTextoAtivo,
                ]}
              >
                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Filtrar */}
        {/* <TouchableOpacity
          onPress={() => {}}
          style={styles.botaoFiltrar}
        >
          <Text style={styles.botaoFiltrarTexto}>Filtrar</Text>
        </TouchableOpacity> */}
      </View>

      {/* Lista */}
      {solicitacoesFiltradas.length === 0 ? (
        <Text style={styles.vazio}>
          {solicitacoes.length === 0
            ? "Você ainda não fez nenhuma solicitação."
            : "Nenhuma solicitação encontrada para este filtro."}
        </Text>
      ) : (
        <FlatList
          data={solicitacoesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0a112e",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  filtrosWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  filtrosTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a112e",
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0a112e",
    marginTop: 12,
    marginBottom: 6,
  },
  filtrosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filtroBotao: {
    backgroundColor: "#ffffff20",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f5a522",
  },
  filtroBotaoAtivo: {
    backgroundColor: "#f5a522",
  },
  filtroTexto: {
    color: "#0a112e",
    fontSize: 14,
  },
  filtroTextoAtivo: {
    fontWeight: "bold",
  },
  inputBusca: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#0a112e",
  },
  botaoFiltrar: {
    backgroundColor: "#f5a522",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 16,
    alignItems: "center",
  },
  botaoFiltrarTexto: {
    color: "#0a112e",
    fontWeight: "bold",
    fontSize: 16,
  },
  lista: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0a112e",
  },
  cardDescricao: {
    fontSize: 14,
    color: "#4e5264",
    marginBottom: 4,
  },
  cardStatusLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  cardStatus: {
    fontSize: 13,
  },
  cardData: {
    fontSize: 12,
    color: "#4e5264",
  },
  vazio: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 32,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a112e",
  },
  loadingText: {
    fontSize: 16,
    color: "#f5a522",
  },
});

export default MinhasSolicitacoes;