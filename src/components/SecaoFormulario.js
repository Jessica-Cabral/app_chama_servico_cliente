// components/SecaoFormulario.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SecaoFormulario({ titulo, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{titulo}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
});