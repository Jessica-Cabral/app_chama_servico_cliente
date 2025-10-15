// Api para gerenciamento das solicitações de serviço
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/solicitacoes';

//const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/solicitacoes.php';
const UPLOAD_URL = 'https://chamaservico.tds104-senac.online/api/cliente/upload_imagem_solicitacao.php';
//const { token } = useContext(AuthContext);

export async function listarSolicitacoes(cliente_id, filtros = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cliente_id, ...filtros })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao buscar solicitações' };
  }
}

export async function criarSolicitacao(
  dados,
  token
) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        cliente_id: dados.cliente_id,
        ...dados
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao criar solicitação' };
  }
}

export async function enviarImagemSolicitacao(solicitacao_id, imagemUri) {
  const formData = new FormData();
  formData.append('solicitacao_id', solicitacao_id);
  formData.append('imagem', {
    uri: imagemUri,
    name: `foto_${Date.now()}.jpg`,
    type: 'image/jpeg'
  });

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    });

    const resultado = await response.json();
    console.log('Resultado do envio da imagem:', resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao enviar imagem:', error);
    return { erro: 'Erro ao enviar imagem' };
  }
}

export async function atualizarSolicitacao(solicitacao_id, dadosAtualizados) {
  try {
    const response = await fetch(`${API_URL}/solicitacoes/${solicitacao_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAtualizados),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao atualizar solicitação' };
  }
}