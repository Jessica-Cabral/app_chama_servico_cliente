import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  secureTextEntry = false,
}) => {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const handleChange = (text) => {
    if (tipo === 'datetime') {
      const formatado = aplicarMascaraDataHora(text);
      onChangeText(formatado);
    } else {
      onChangeText(text);
    }
  };

  const isPassword = tipo === 'password' || secureTextEntry;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.input, erro && styles.inputErro, { flex: 1 }]}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor="#aaa"
          maxLength={maxLength}
          secureTextEntry={isPassword && !mostrarSenha}
        />
        {isPassword && (
          <Ionicons
            name={mostrarSenha ? 'eye-off' : 'eye'}
            size={24}
            color="#283579"
            style={{ marginLeft: 8 }}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          />
        )}
      </View>
      {erro && <Text style={styles.textoErro}>{erro}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#283579',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#0a112e",
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