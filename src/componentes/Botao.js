
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores2';

const Botao = ({ 
  titulo, 
  aoPressionar, 
  estilo, 
  estiloTexto, 
  variante = 'primario',
  desabilitado = false 
}) => {
  const obterEstiloBotao = () => {
    switch (variante) {
      case 'secundario':
        return styles.botaoSecundario;
      case 'outline':
        return styles.botaoOutline;
      default:
        return styles.botaoPrimario;
    }
  };

  const obterEstiloTexto = () => {
    switch (variante) {
      case 'outline':
        return styles.textoOutline;
      default:
        return styles.textoBotao;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.botaoBase,
        obterEstiloBotao(),
        desabilitado && styles.botaoDesabilitado,
        estilo
      ]}
      onPress={aoPressionar}
      disabled={desabilitado}
    >
      <Text style={[obterEstiloTexto(), estiloTexto]}>
        {titulo}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botaoBase: {
    paddingVertical: ESPACAMENTOS.MEDIO,
    paddingHorizontal: ESPACAMENTOS.GRANDE,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPrimario: {
    backgroundColor: CORES.PRIMARIA,
  },
  botaoSecundario: {
    backgroundColor: CORES.SECUNDARIA,
  },
  botaoOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: CORES.PRIMARIA,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  textoBotao: {
    color: CORES.BRANCA,
    fontSize: TAMANHOS_FONTE.GRANDE,
    fontWeight: 'bold',
  },
  textoOutline: {
    color: CORES.PRIMARIA,
    fontSize: TAMANHOS_FONTE.GRANDE,
    fontWeight: 'bold',
  },
});

export default Botao;
