import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SelectCampo = ({
  label,
  selectedValue,
  onValueChange,
  options,
  erro,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.pickerContainer, erro && styles.pickerErro]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label="Selecione..." value="" />
          {options.map((opt) => (
            <Picker.Item key={opt.id} label={opt.nome} value={opt.id} />
          ))}
        </Picker>
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
    color: '#fff',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerErro: {
    borderColor: 'red',
    borderWidth: 1,
  },
  textoErro: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});

export default SelectCampo;