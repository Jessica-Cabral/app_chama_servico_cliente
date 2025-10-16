import { View, Text, StyleSheet, Alert } from 'react-native';
import Botao from './Botao';

export default function EnderecoCard({ endereco, onDefinirPrincipal, onExcluir }) {
  const confirmarExclusao = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onExcluir(endereco.id) }
      ]
    );
  };

  return (
    <View style={styles.card}>
      {endereco.principal === 1 && (
        <View style={styles.principalTag}>
          <Text style={styles.principalTexto}>★ Endereço Principal</Text>
        </View>
      )}

      <Text style={styles.texto}>{endereco.logradouro}, {endereco.numero}</Text>
      <Text style={styles.texto}>{endereco.bairro}</Text>
      <Text style={styles.texto}>{endereco.complemento}</Text>
      <Text style={styles.texto}>{endereco.cidade}/{endereco.estado}</Text>
      <Text style={styles.texto}>CEP: {endereco.cep}</Text>

      <View style={styles.botoes}>
        {endereco.principal !== 1 && (
          <Botao
            title="Definir como Principal"
            variante="primario"
            onPress={() => onDefinirPrincipal(endereco.id)}
          />
        )}
        <Botao
          title="Excluir"
          variante="secundario"
          onPress={() => confirmarExclusao(endereco.id)}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
  backgroundColor: '#e0e0e0',
  padding: 16,
  borderRadius: 10,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
principalTag: {
  backgroundColor: '#f5a522',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 6,
  alignSelf: 'flex-start',
  marginBottom: 8,
},
principalTexto: {
  color: '#ffffff',
  fontWeight: 'bold',
},
texto: {
  color: '#0a112e',
  fontSize: 14,
  marginBottom: 4,
},
botoes: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 12,
  gap: 8,
},
});