 import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const Input = ({
  title,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  style,
  styleContainer,
  obrigatorio = false,
  erro,
}) => {
  return (
    <View style={[styles.container, styleContainer]}>
      {title && (
        <Text style={styles.title}>
          {title}
          {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiLinhas,
          erro && styles.inputErro,
          style
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {erro && <Text style={styles.textoErro}>{erro}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 16, 
    fontWeight: '500',
    color: '#4e5264',
    marginBottom: 8 / 2,
  },
  obrigatorio: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4e5264',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#FFF',
  },
  inputMultiLinhas: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputErro: {
    borderColor: '#EF4444',
  },
  textoErro: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8 / 2,
  },
});

export default Input;
