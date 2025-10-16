import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StatusCard = ({ label, count, icon, color }) => {
  return (
    <View style={styles.cardsStatus}>
      {["pendente", "andamento", "concluido"].map((status) => (
        <View key={status} style={styles.cardStatus}>
          <Ionicons
            name={obterIconeStatus(status)}
            size={24}
            color={obterCorStatus(status)}
          />
          <Text style={styles.numeroStatus}>{contarStatus(status)}</Text>
          <Text style={styles.labelStatus}>
            {status === "pendente" && "Pendentes"}
            {status === "andamento" && "Em Andamento"}
            {status === "concluido" && "Concluídos"}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    width: "30%",
  },
  count: { fontSize: 18, fontWeight: "bold", color: "#0a112e", marginTop: 8 },
  label: { fontSize: 14, color: "#4e5264" },
});

export default StatusCard;
