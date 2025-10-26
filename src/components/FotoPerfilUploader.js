import React, { useState } from 'react';
import { View, Image, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MAX_IMAGE_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export default function FotoPerfilUploader({ fotoAtual }) {
  const [imagem, setImagem] = useState(fotoAtual);

  const escolherImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      const file = resultado.assets[0];

      if (!ALLOWED_TYPES.includes(file.mimeType)) {
        Alert.alert('Erro', 'A imagem deve ser PNG ou JPEG.');
        return;
      }

      const tamanhoMB = file.fileSize / (1024 * 1024);
      if (tamanhoMB > MAX_IMAGE_SIZE_MB) {
        Alert.alert('Erro', 'A imagem deve ter no máximo 2MB.');
        return;
      }

      setImagem(file.uri);
      enviarImagem(file);
    }
  };

  const enviarImagem = async (file) => {
    try {
      const formData = new FormData();
      formData.append('foto_perfil', {
        uri: file.uri,
        name: 'perfil.jpg',
        type: file.mimeType,
      });

      const response = await fetch('https://sua-api.com/upload-foto', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer SEU_TOKEN_AQUI',
        },
        body: formData,
      });

      const resultado = await response.json();
      if (resultado.sucesso) {
        Alert.alert('Sucesso', 'Foto de perfil atualizada!');
      } else {
        Alert.alert('Erro', resultado.erro || 'Falha ao enviar imagem.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar imagem.');
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={imagem ? { uri: imagem } : require('../../assets/default_profile.png')}
        style={styles.imagem}
      /> */}
      <Button title="Alterar Foto de Perfil" onPress={escolherImagem} color="#f5a522" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#283579',
  },
});
