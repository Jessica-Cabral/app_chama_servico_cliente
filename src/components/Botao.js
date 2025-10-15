import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const Botao = ({
  title,
  onPress,
  style,
  styleTexto,
  variante = 'primario',
  disabled = false,
  icon = null,
  activeOpacity = 0.7,
}) => {
  const obterEstiloBotao = () => {
    switch (variante) {
      case 'secundario':
        return styles.botaoSecundario;
      case 'outline':
        return styles.botaoOutline;
      case 'escuro':
        return styles.botaoEscuro;
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
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
    >
      <View style={styles.conteudoBotao}>
        {icon && <View style={styles.icone}>{icon}</View>}
        <Text style={[obterEstiloTexto(), styleTexto]}>{title}</Text>
      </View>
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
    backgroundColor: '#f5a522',
  },
  botaoSecundario: {
    backgroundColor: '#283579',
  },
   botaoEscuro: {
    backgroundColor: '#0a112e',
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
  conteudoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    marginRight: 8,
  },
});

export default Botao;