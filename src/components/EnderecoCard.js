import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function EnderecoCard({ endereco }) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{endereco.logradouro}, {endereco.numero}</Text>
      <Text style={styles.text}>{endereco.bairro} - {endereco.cidade}/{endereco.estado}</Text>
      <Text style={styles.text}>CEP: {endereco.cep}</Text>
      <View style={styles.actions}>
        <Button title="Editar" onPress={() => {}} color="#283579" />
        <Button title="Excluir" onPress={() => {}} color="#EF4444" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#4e5264',
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    color: '#0a112e',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
