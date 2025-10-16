import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CardSolicitacao = ({ item }) => {
  const obterCorStatus = (status) => {
    switch (status) {
      case "pendente":
        return "#f5a522";
      case "andamento":
        return "#283579";
      case "concluido":
        return "#10B981";
      default:
        return "#4e5264";
    }
  };

  const obterIconeStatus = (status) => {
    switch (status) {
      case "pendente":
        return "time-outline";
      case "andamento":
        return "alert-circle-outline";
      case "concluido":
        return "checkmark-circle-outline";
      default:
        return "time-outline";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.titulo}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: obterCorStatus(item.status) },
          ]}
        >
          <Ionicons
            name={obterIconeStatus(item.status)}
            size={12}
            color="#fff"
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.detail}>Endereço: {item.endereco}</Text>
      <Text style={styles.detail}>Data: {item.data_atendimento}</Text>
      <Text style={styles.detail}>Categoria: {item.tipo_servico}</Text>
      <Text style={styles.detail}>Valor: R$ {item.orcamento_estimado}</Text>
      {item.prestador && (
        <View style={styles.prestadorContainer}>
          <Ionicons name="person" size={16} color="#4e5264" />
          <Text style={styles.prestadorText}>Prestador: {item.prestador}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#0a112e" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusIcon: { marginRight: 4 },
  statusText: { fontSize: 12, color: "#fff" },
  detail: { fontSize: 14, color: "#4e5264", marginBottom: 4 },
  prestadorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  prestadorText: { fontSize: 14, color: "#4e5264" },
});

export default CardSolicitacao;
