import React, { useEffect, useState, useContext } from "react";
import { View, ScrollView, StyleSheet, Alert, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "../context/AuthContext";
import { consultarPerfil, atualizarPerfil } from "../services/perfil";
import {
  listarEnderecos,
  definirEnderecoPrincipal,
  excluirEndereco,
} from "../services/enderecos";
import EnderecoCard from "../components/EnderecoCard";
import FotoPerfilUploader from "../components/FotoPerfilUploader";
import InputCampo from "../components/InputCampo";
import Botao from "../components/Botao";

export default function PerfilCliente() {
  const { usuario, token } = useContext(AuthContext);
  const [perfil, setPerfil] = useState({});
  const [enderecos, setEnderecos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // novo endereco
  const [mostrarFormularioEndereco, setMostrarFormularioEndereco] =
    useState(false);
  const [novoEndereco, setNovoEndereco] = useState({
    cep: "",
    numero: "",
    complemento: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    if (usuario?.id && token) {
      carregarDados();
    }
  }, [usuario, token]);

  const carregarDados = async () => {
    const perfilResponse = await consultarPerfil(usuario.id, token);
    const enderecosResponse = await listarEnderecos(usuario.id, token);

    if (perfilResponse.sucesso) {
      setPerfil(perfilResponse.perfil);
    } else {
      Alert.alert(
        "Erro",
        perfilResponse.erro || "Não foi possível carregar o perfil"
      );
    }

    if (enderecosResponse.sucesso) {
      setEnderecos(enderecosResponse.enderecos);
    } else {
      Alert.alert(
        "Erro",
        enderecosResponse.erro || "Não foi possível carregar os endereços"
      );
    }
  };

  const handleSalvar = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    const response = await atualizarPerfil(
      usuario.id,
      perfil.nome,
      perfil.email,
      perfil.telefone,
      perfil.cpf,
      perfil.dt_nascimento,
      token
    );

    if (response.sucesso) {
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setEditando(false);
      carregarDados();
    } else {
      Alert.alert("Erro", response.erro || "Erro ao atualizar perfil");
    }
  };

  //Função para buscar dados cep viacep

  const buscarCep = async () => {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${novoEndereco.cep}/json/`
      );
      const data = await response.json();
      if (data.erro) {
        Alert.alert("Erro", "CEP não encontrado");
        return;
      }
      setNovoEndereco((prev) => ({
        ...prev,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }));
    } catch {
      Alert.alert("Erro", "Falha ao buscar CEP");
    }
  };
  //Função para definir endereço como principal
  const handleDefinirPrincipal = async (enderecoId) => {
    const response = await definirEnderecoPrincipal(
      usuario.id,
      enderecoId,
      token
    );
    if (response.sucesso) {
      Alert.alert("Sucesso", "Endereço definido como principal");
      const atualizados = await listarEnderecos(usuario.id, token);
      if (atualizados.sucesso) {
        const enderecosAtualizados = atualizados.enderecos.map((end) => ({
          ...end,
          principal: end.id === enderecoId ? 1 : 0,
        }));
        setEnderecos(atualizados.enderecos);
      } else {
        Alert.alert("Erro", response.erro || "Não foi possível atualizar");
      }
    }
  };

  //Função para cadastrar novo endereço

  const handleCadastrarEndereco = async () => {
    const { cep, numero, complemento } = novoEndereco;
    const response = await cadastrarEndereco(
      usuario.id,
      cep,
      numero,
      complemento,
      false
    );
    if (response.sucesso) {
      Alert.alert("Sucesso", "Endereço cadastrado");
      setMostrarFormularioEndereco(false);
      setNovoEndereco({
        cep: "",
        numero: "",
        complemento: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
      });
      carregarDados();
    } else {
      Alert.alert("Erro", response.erro || "Erro ao cadastrar endereço");
    }
  };

  const handleExcluirEndereco = async (enderecoId) => {
    const response = await excluirEndereco(usuario.id, enderecoId, token);
    if (response.sucesso) {
      Alert.alert("Sucesso", "Endereço excluído com sucesso");
      carregarDados();
    } else {
      Alert.alert("Erro", response.erro || "Não foi possível excluir");
    }
  };

  return (
    <LinearGradient colors={["#0a112e", "#283579"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <FotoPerfilUploader fotoAtual={perfil.foto_perfil} />

          <InputCampo
            label="Nome completo *"
            value={perfil.nome}
            editable={editando}
            onChangeText={(text) => setPerfil({ ...perfil, nome: text })}
            placeholder="Digite seu nome"
          />

          <InputCampo
            label="Email *"
            value={perfil.email}
            editable={editando}
            onChangeText={(text) => setPerfil({ ...perfil, email: text })}
            placeholder="Digite seu email"
            keyboardType="email-address"
          />

          <InputCampo
            label="Telefone *"
            value={perfil.telefone}
            editable={editando}
            onChangeText={(text) => setPerfil({ ...perfil, telefone: text })}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
          />

          <InputCampo label="CPF" value={perfil.cpf} editable={false} />

          <InputCampo
            label="Data de nascimento"
            value={perfil.dt_nascimento}
            editable={false}
            tipo="datetime"
          />

          {editando && (
            <>
              <InputCampo
                label="Nova senha"
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Digite a nova senha"
                secureTextEntry
              />
              <InputCampo
                label="Confirmar nova senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Confirme a nova senha"
                secureTextEntry
              />
            </>
          )}

          <Botao
            title={editando ? "Salvar alterações" : "Editar perfil"}
            onPress={() => (editando ? handleSalvar() : setEditando(true))}
            variante="primario"
          />

          {editando && (
            <Botao
              title="Cancelar"
              onPress={() => setEditando(false)}
              variante="secundario"
            />
          )}
        </View>

        <View style={styles.enderecos}>
          <View style={styles.enderecosHeader}>
            <View>
              <Text style={styles.enderecosTitulo}>Meus Endereços</Text>
              <Text style={styles.enderecosContador}>{enderecos.length} cadastrados</Text>
            </View>
            <Botao
              icone={<Ionicons name="add-circle-sharp" size={24} color="black" />}
              title=""
              variante="primario"
              onPress={() => setMostrarFormularioEndereco(true)}
            />
          </View>

          {mostrarFormularioEndereco && (
            <View style={[styles.card, { marginBottom: 12 }]}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View style={{ flex: 1 }}>
                  <InputCampo
                    label="CEP"
                    value={novoEndereco.cep}
                    onChangeText={(text) =>
                      setNovoEndereco({ ...novoEndereco, cep: text })
                    }
                    keyboardType="numeric"
                  />
                </View>
                <Botao
                  icone="search"
                  variante="outline"
                  onPress={buscarCep}
                  style={{ height: 40 }}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <InputCampo
                    label="Logradouro"
                    value={novoEndereco.logradouro}
                    editable={false}
                  />
                </View>
                <InputCampo
                  label="Número"
                  value={novoEndereco.numero}
                  onChangeText={(text) =>
                    setNovoEndereco({ ...novoEndereco, numero: text })
                  }
                />
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <InputCampo
                    label="Complemento"
                    value={novoEndereco.complemento}
                    onChangeText={(text) =>
                      setNovoEndereco({ ...novoEndereco, complemento: text })
                    }
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <InputCampo
                  label="Bairro"
                  value={novoEndereco.bairro}
                  editable={false}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <InputCampo
                    label="Cidade"
                    value={novoEndereco.cidade}
                    editable={false}
                  />
                </View>
                <InputCampo
                  label="Estado"
                  value={novoEndereco.estado}
                  editable={false}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <Botao
                  title="Salvar"
                  onPress={handleCadastrarEndereco}
                  variante="primario"
                  style={{ flex: 1 }}
                />
                <Botao
                  title="Cancelar"
                  onPress={() => setMostrarFormularioEndereco(false)}
                  variante="secundario"
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}

          <View style={{ gap: 12 }}>
            {enderecos.map((endereco) => (
              <EnderecoCard
                key={endereco.id}
                endereco={endereco}
                onDefinirPrincipal={handleDefinirPrincipal}
                onExcluir={handleExcluirEndereco}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#4e5264",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  enderecos: {
    //marginTop: 24,
    marginBottom: 12,
  },
enderecosHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 12,
  marginBottom: 12,
},
enderecosTitulo: {
  fontSize: 18,
  color: '#ffffff',
  fontWeight: 'bold',
},
enderecosContador: {
  color: '#d6e3ff',
  fontSize: 12,
  marginTop: 4,
},
});
