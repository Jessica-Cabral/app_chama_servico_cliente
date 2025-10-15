import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const aplicarMascaraDataHora = (text) => {
  const cleaned = text.replace(/\D/g, '');

  let formatado = '';

  if (cleaned.length >= 1) formatado += cleaned.slice(0, 2); // dia
  if (cleaned.length >= 3) formatado += '/' + cleaned.slice(2, 4); // mês
  if (cleaned.length >= 5) formatado += '/' + cleaned.slice(4, 8); // ano
  if (cleaned.length >= 9) formatado += ' ' + cleaned.slice(8, 10); // hora
  if (cleaned.length >= 11) formatado += ':' + cleaned.slice(10, 12); // minuto

  return formatado;
};

const InputCampo = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = true,
  erro,
  tipo = 'text',
  maxLength,
}) => {
  const handleChange = (text) => {
    if (tipo === 'datetime') {
      const formatado = aplicarMascaraDataHora(text);
      onChangeText(formatado);
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erro && styles.inputErro]}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor="#aaa"
        maxLength={maxLength}
      />
      {erro && <Text style={styles.textoErro}>{erro}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  inputErro: {
    borderColor: 'red',
    borderWidth: 1,
  },
  textoErro: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});

export default InputCampo;