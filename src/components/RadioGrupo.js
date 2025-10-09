import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RadioGrupo({ label, options, selected, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.opcao, selected === opt && styles.selecionado]}
          onPress={() => onSelect(opt)}
        >
          <Text style={styles.texto}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, color: '#0a112e', marginBottom: 4 },
  opcao: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 4,
  },
  selecionado: {
    backgroundColor: '#f5a522',
    borderColor: '#f5a522',
  },
  texto: { color: '#0a112e' },
});