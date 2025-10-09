import React from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';

export default function SelectCampo({ label, selectedValue, onValueChange, options }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {options.map((opt) => (
          <Picker.Item key={opt.id} label={opt.nome} value={opt.id} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, color: '#0a112e', marginBottom: 4 },
  picker: { backgroundColor: '#fff', borderRadius: 8 },
});