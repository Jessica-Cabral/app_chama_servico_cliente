// components/RadioGrupoUrgencia.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const cores = {
  normal: '#4CAF50',
  media: '#FFC107',
  urgente: '#F44336',
};

const icones = {
  normal: 'smile-o',
  media: 'exclamation-circle',
  urgente: 'exclamation-triangle',
};

export default function RadioGrupoUrgencia({ selected, onSelect }) {
  const options = ['normal', 'media', 'urgente'];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Urgência</Text>
      <View style={styles.row}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.option,
              selected === opt && { borderColor: cores[opt], backgroundColor: `${cores[opt]}33` },
            ]}
            onPress={() => onSelect(opt)}
          >
            <FontAwesome name={icones[opt]} size={20} color={cores[opt]} style={styles.icon} />
            <Text style={[styles.text, selected === opt && { color: cores[opt] }]}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#f5a522',
    marginBottom: 8,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    color: '#ffffff',
  },
});