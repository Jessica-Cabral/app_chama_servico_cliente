import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Botao from './Botao';

export default function EnderecoCard({ endereco, onDefinirPrincipal, onExcluir }) {
  const confirmarExclusao = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onExcluir(endereco.id) }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.texto}>{endereco.logradouro}, {endereco.numero}</Text>
      <Text style={styles.texto}>{endereco.bairro}</Text>
      <Text style={styles.texto}>{endereco.cidade}/{endereco.estado}</Text>
      <Text style={styles.texto}>CEP: {endereco.cep}</Text>

      {endereco.principal === 1 && (
        <Text style={styles.flagPrincipal}>Endereço Principal</Text>
      )}

      <View style={styles.botoes}>
        {endereco.principal !== 1 && (
          <Botao
            title="Definir como Principal"
            variante="primario"
            onPress={() => onDefinirPrincipal(endereco.id)}
          />
        )}
        <Botao
          title="Excluir"
          variante="secundario"
          onPress={confirmarExclusao}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#4e5264',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  texto: {
    color: '#0a112e',
    fontSize: 14,
    marginBottom: 4,
  },
  flagPrincipal: {
    backgroundColor: '#f5a522',
    color: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
});