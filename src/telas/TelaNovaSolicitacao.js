
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CampoTexto from '../componentes/CampoTexto';
import Seletor from '../componentes/Seletor';
import Botao from '../componentes/Botao';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../constantes/Cores2';
import { TIPOS_SERVICO, SERVICOS_POR_TIPO, OPCOES_URGENCIA } from '../dados/DadosServicos';

const TelaNovaSolicitacao = ({ navigation }) => {
  // Estados para dados do solicitante
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Estados para endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Estados para detalhes do serviço
  const [tipoServico, setTipoServico] = useState('');
  const [servico, setServico] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [descricao, setDescricao] = useState('');

  const buscarCep = async (cepValue) => {
    const cepLimpo = cepValue.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
        Alert.alert('Sucesso', 'CEP encontrado!');
      } else {
        Alert.alert('Erro', 'CEP não encontrado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar CEP');
    }
  };

  const manipularMudancaCep = (valor) => {
    setCep(valor);
    if (valor.length === 8 || valor.length === 9) {
      buscarCep(valor);
    }
  };

  const manipularMudancaTipoServico = (novoTipo) => {
    setTipoServico(novoTipo);
    setServico(''); // Reset serviço quando tipo muda
  };

  const obterItensServico = () => {
    if (!tipoServico) return [];
    
    const servicosDisponiveis = SERVICOS_POR_TIPO[tipoServico] || [];
    return servicosDisponiveis.map(servico => ({
      label: servico.nome,
      value: servico.id.toString(),
    }));
  };

  const manipularSubmit = () => {
    // Validação básica
    if (!nomeCompleto || !telefone || !email || !cep || !tipoServico || !servico || !urgencia || !descricao) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    Alert.alert('Sucesso', 'Solicitação enviada com sucesso!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('TelaDashboardCliente'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={CORES.CINZA_ESCURO} />
          <Text style={styles.textoVoltar}>Voltar ao Dashboard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.containerTitulo}>
          <Text style={styles.titulo}>Nova Solicitação de Serviço</Text>
        </View>

        {/* Dados do Solicitante */}
        <View style={styles.secao}>
          <View style={styles.tituloSecao}>
            <Ionicons name="person" size={20} color={CORES.PRIMARIA} />
            <Text style={styles.textoTituloSecao}>Dados do Solicitante</Text>
          </View>
          
          <CampoTexto
            rotulo="Nome Completo"
            valor={nomeCompleto}
            aoMudar={setNomeCompleto}
            placeholder="Seu nome completo"
            obrigatorio
          />
          
          <CampoTexto
            rotulo="Telefone"
            valor={telefone}
            aoMudar={setTelefone}
            placeholder="(00) 00000-0000"
            tipoTeclado="phone-pad"
            obrigatorio
          />
          
          <CampoTexto
            rotulo="E-mail"
            valor={email}
            aoMudar={setEmail}
            placeholder="seu@email.com"
            tipoTeclado="email-address"
            obrigatorio
          />
        </View>

        {/* Endereço do Serviço */}
        <View style={styles.secao}>
          <View style={styles.tituloSecao}>
            <Ionicons name="location" size={20} color={CORES.PRIMARIA} />
            <Text style={styles.textoTituloSecao}>Endereço do Serviço</Text>
          </View>
          
          <CampoTexto
            rotulo="CEP"
            valor={cep}
            aoMudar={manipularMudancaCep}
            placeholder="00000-000"
            tipoTeclado="numeric"
            obrigatorio
          />
          
          <CampoTexto
            rotulo="Logradouro"
            valor={logradouro}
            aoMudar={setLogradouro}
            placeholder="Rua, Avenida..."
            obrigatorio
          />
          
          <View style={styles.linha}>
            <CampoTexto
              rotulo="Número"
              valor={numero}
              aoMudar={setNumero}
              placeholder="123"
              estiloContainer={styles.campoMetade}
              obrigatorio
            />
            
            <CampoTexto
              rotulo="Complemento"
              valor={complemento}
              aoMudar={setComplemento}
              placeholder="Apto, Casa..."
              estiloContainer={styles.campoMetade}
            />
          </View>
          
          <CampoTexto
            rotulo="Bairro"
            valor={bairro}
            aoMudar={setBairro}
            placeholder="Nome do bairro"
            obrigatorio
          />
          
          <View style={styles.linha}>
            <CampoTexto
              rotulo="Cidade"
              valor={cidade}
              aoMudar={setCidade}
              placeholder="Nome da cidade"
              estiloContainer={styles.campoMetade}
              obrigatorio
            />
            
            <CampoTexto
              rotulo="Estado"
              valor={estado}
              aoMudar={setEstado}
              placeholder="UF"
              estiloContainer={styles.campoMetade}
              obrigatorio
            />
          </View>
        </View>

        {/* Detalhes do Serviço */}
        <View style={styles.secao}>
          <View style={styles.tituloSecao}>
            <Ionicons name="document-text" size={20} color={CORES.PRIMARIA} />
            <Text style={styles.textoTituloSecao}>Detalhes do Serviço</Text>
          </View>
          
          <Seletor
            rotulo="Tipo de Serviço"
            valor={tipoServico}
            aoMudar={manipularMudancaTipoServico}
            itens={TIPOS_SERVICO.map(tipo => ({
              label: tipo.nome,
              value: tipo.id.toString(),
            }))}
            placeholder={{ label: 'Selecione o tipo de serviço', value: null }}
            obrigatorio
          />
          
          <Seletor
            rotulo="Serviço"
            valor={servico}
            aoMudar={setServico}
            itens={obterItensServico()}
            placeholder={{ label: 'Selecione o serviço', value: null }}
            desabilitado={!tipoServico}
            obrigatorio
          />
          
          <Seletor
            rotulo="Urgência"
            valor={urgencia}
            aoMudar={setUrgencia}
            itens={OPCOES_URGENCIA}
            placeholder={{ label: 'Selecione a urgência', value: null }}
            obrigatorio
          />
          
          <CampoTexto
            rotulo="Descrição Detalhada"
            valor={descricao}
            aoMudar={setDescricao}
            placeholder="Descreva detalhadamente o problema ou serviço necessário..."
            multiLinhas
            numeroLinhas={4}
            obrigatorio
          />
        </View>

        {/* Botões de Ação */}
        <View style={styles.containerBotoes}>
          <Botao
            titulo="Cancelar"
            aoPressionar={() => navigation.goBack()}
            variante="outline"
            estilo={styles.botaoCancelar}
          />
          <Botao
            titulo="Enviar Solicitação"
            aoPressionar={manipularSubmit}
            estilo={styles.botaoEnviar}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.CINZA_CLARO,
  },
  cabecalho: {
    backgroundColor: CORES.BRANCA,
    paddingHorizontal: ESPACAMENTOS.GRANDE,
    paddingVertical: ESPACAMENTOS.MEDIO,
    borderBottomWidth: 1,
    borderBottomColor: CORES.CINZA,
  },
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoVoltar: {
    color: CORES.CINZA_ESCURO,
    fontSize: TAMANHOS_FONTE.MEDIO,
    marginLeft: ESPACAMENTOS.PEQUENO,
  },
  scrollContainer: {
    flex: 1,
  },
  containerTitulo: {
    alignItems: 'center',
    paddingVertical: ESPACAMENTOS.EXTRA_GRANDE,
  },
  titulo: {
    fontSize: TAMANHOS_FONTE.TITULO,
    fontWeight: "bold",
    color: CORES.CINZA_ESCURO,
  },
  secao: {
    backgroundColor: CORES.BRANCA,
    marginHorizontal: ESPACAMENTOS.GRANDE,
    marginBottom: ESPACAMENTOS.GRANDE,
    borderRadius: 12,
    padding: ESPACAMENTOS.GRANDE,
  },
  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.GRANDE,
  },
  textoTituloSecao: {
    fontSize: TAMANHOS_FONTE.EXTRA_GRANDE,
    fontWeight: "bold",
    color: CORES.CINZA_ESCURO,
    marginLeft: ESPACAMENTOS.PEQUENO,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campoMetade: {
    width: '48%',
  },
  containerBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ESPACAMENTOS.GRANDE,
    paddingVertical: ESPACAMENTOS.EXTRA_GRANDE,
  },
  botaoCancelar: {
    width: '45%',
  },
  botaoEnviar: {
    width: '45%',
  },
});

export default TelaNovaSolicitacao;
