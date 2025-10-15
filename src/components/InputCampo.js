import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputCampo = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = true,
  erro,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erro && styles.inputErro]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor="#aaa"
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