
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores2';

const CampoTexto = ({
  rotulo,
  valor,
  aoMudar,
  placeholder,
  tipoTeclado = 'default',
  seguro = false,
  multiLinhas = false,
  numeroLinhas = 1,
  estilo,
  estiloContainer,
  obrigatorio = false,
  erro,
}) => {
  return (
    <View style={[styles.container, estiloContainer]}>
      {rotulo && (
        <Text style={styles.rotulo}>
          {rotulo}
          {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          multiLinhas && styles.inputMultiLinhas,
          erro && styles.inputErro,
          estilo
        ]}
        value={valor}
        onChangeText={aoMudar}
        placeholder={placeholder}
        keyboardType={tipoTeclado}
        secureTextEntry={seguro}
        multiline={multiLinhas}
        numberOfLines={numeroLinhas}
      />
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
  input: {
    borderWidth: 1,
    borderColor: CORES.CINZA,
    borderRadius: 8,
    paddingHorizontal: ESPACAMENTOS.MEDIO,
    paddingVertical: ESPACAMENTOS.PEQUENO,
    fontSize: TAMANHOS_FONTE.MEDIO,
    backgroundColor: CORES.BRANCA,
  },
  inputMultiLinhas: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputErro: {
    borderColor: CORES.VERMELHA,
  },
  textoErro: {
    color: CORES.VERMELHA,
    fontSize: TAMANHOS_FONTE.PEQUENO,
    marginTop: ESPACAMENTOS.PEQUENO / 2,
  },
});

export default CampoTexto;
