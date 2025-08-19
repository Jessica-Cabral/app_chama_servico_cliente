
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores2';

const Seletor = ({
  rotulo,
  valor,
  aoMudar,
  itens,
  placeholder,
  estilo,
  estiloContainer,
  obrigatorio = false,
  erro,
  desabilitado = false,
}) => {
  return (
    <View style={[styles.container, estiloContainer]}>
      {rotulo && (
        <Text style={styles.rotulo}>
          {rotulo}
          {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
        </Text>
      )}
      <View style={[styles.seletorContainer, erro && styles.seletorErro]}>
        <RNPickerSelect
          placeholder={placeholder ? { label: placeholder, value: null } : {}}
          items={itens}
          onValueChange={aoMudar}
          value={valor}
          style={{
            inputIOS: styles.seletorIOS,
            inputAndroid: styles.seletorAndroid,
          }}
          disabled={desabilitado}
        />
      </View>
      {erro && <Text style={styles.textoErro}>{erro}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ESPACAMENTOS.MEDIO,
  },
  rotulo: {
    fontSize: TAMANHOS_FONTE.MEDIO,
    fontWeight: '500',
    color: CORES.CINZA_ESCURO,
    marginBottom: ESPACAMENTOS.PEQUENO / 2,
  },
  obrigatorio: {
    color: CORES.VERMELHA,
  },
  seletorContainer: {
    borderWidth: 1,
    borderColor: CORES.CINZA,
    borderRadius: 8,
    backgroundColor: CORES.BRANCA,
  },
  seletorErro: {
    borderColor: CORES.VERMELHA,
  },
  seletorIOS: {
    fontSize: TAMANHOS_FONTE.MEDIO,
    paddingVertical: ESPACAMENTOS.PEQUENO,
    paddingHorizontal: ESPACAMENTOS.MEDIO,
    color: CORES.PRETA,
  },
  seletorAndroid: {
    fontSize: TAMANHOS_FONTE.MEDIO,
    paddingVertical: ESPACAMENTOS.PEQUENO,
    paddingHorizontal: ESPACAMENTOS.MEDIO,
    color: CORES.PRETA,
  },
  textoErro: {
    color: CORES.VERMELHA,
    fontSize: TAMANHOS_FONTE.PEQUENO,
    marginTop: ESPACAMENTOS.PEQUENO / 2,
  },
});

export default Seletor;
