import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputCampo({ label, value, onChangeText, placeholder, editable = true, secureTextEntry = false }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#0a112e',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4e5264',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    color: '#4e5264',
  },
});
