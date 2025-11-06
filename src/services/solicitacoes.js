// Api para gerenciamento das solicitações de serviço
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/solicitacoes';
const UPLOAD_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/upload_imagem';

export async function listarSolicitacoes(cliente_id, token, filtros = {}) {
  try {
    const queryParams = new URLSearchParams({
      cliente_id: cliente_id,
      ...filtros
    }).toString();

    const response = await fetch(`${API_URL}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    return { erro: 'Erro ao buscar solicitações' };
  }
}

export async function buscarSolicitacaoPorId(solicitacao_id, token) {
  try {
    const response = await fetch(
      `https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/solicitacao?solicitacao_id=${solicitacao_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar solicitação:', error);
    return { erro: 'Erro ao buscar solicitação' };
  }
}

export async function criarSolicitacao(dados, token) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    return { erro: 'Erro ao criar solicitação' };
  }
}

export async function atualizarSolicitacao(solicitacao_id, dadosAtualizados, token) {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...dadosAtualizados,
        solicitacao_id: solicitacao_id
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar solicitação:', error);
    return { erro: 'Erro ao atualizar solicitação' };
  }
}

export async function excluirSolicitacao(solicitacao_id, cliente_id, token) {
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        cliente_id: cliente_id,
        solicitacao_id: solicitacao_id
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao excluir solicitação:', error);
    return { erro: 'Erro ao excluir solicitação' };
  }
}
//ainda não está funcional - Preciso avaliar uso de FTP para enviar as imagens para o servidor
export async function enviarImagemSolicitacao(solicitacao_id, imagemUri, token) {
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
        'Authorization': `Bearer ${token}`,
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