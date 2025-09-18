
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Botao = ({ 
  title, 
  onPress, 
  style, 
  styleTexto, 
  variante = 'primario',
  disabled = false 
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
        disabled && styles.botaoDesabilitado,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[obterEstiloTexto(), styleTexto]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botaoBase: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPrimario: {
    backgroundColor:'#f5a522',
  },
  botaoSecundario: {
    backgroundColor: '#283579',
  },
  botaoOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f5a522',
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,

  },
  textoOutline: {
    color: '#f5a522',
    fontSize: 16,

  },
});

export default Botao;
