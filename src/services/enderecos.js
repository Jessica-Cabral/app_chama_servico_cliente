// Serviço de conexão - API para gerenciamento de endereço

const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/perfil';
const ENDERECO_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/enderecos';

export async function listarEnderecos(cliente_id, token) {
  try {
    const response = await fetch(`${API_URL}?cliente_id=${cliente_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();
    if (data.sucesso && Array.isArray(data.enderecos)) {
        return { sucesso: true, enderecos: data.enderecos };
      } else {
        return { erro: data.erro || 'Endereços não encontrados' };
      }
    } catch (error) {
      return { erro: 'Erro ao buscar endereços' };
    }
}

//Buscar e carregar o endereço via api viacep
export async function buscarEnderecoPorCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return { erro: 'CEP não encontrado' };
    }
    
    return {
      sucesso: true,
      endereco: {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        complemento: data.complemento
      }
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return { erro: 'Erro ao buscar CEP' };
  }
}

// Cadastro do endereço
export async function cadastrarEndereco(dados, token) {
  try {
    console.log('📤 Enviando dados para cadastro:', dados);
    
    const response = await fetch(ENDERECO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });
    
    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return { erro: 'Resposta inválida do servidor' };
    }
    if (!response.ok) {
      return { 
        erro: data.erro || `Erro HTTP ${response.status}: ${response.statusText}` 
      };
    }

    return data;

  } catch (error) {
    return { erro: `Erro de conexão: ${error.message}` };
  }
}

//Definir endereço como principal
export async function definirEnderecoPrincipal(cliente_id, endereco_id, token) {
  try {
    const response = await fetch(ENDERECO_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cliente_id, endereco_id })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao definir endereço principal' };
  }
}

export async function excluirEndereco(cliente_id, endereco_id, token) {
  try {
    const response = await fetch(ENDERECO_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cliente_id, endereco_id })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao excluir endereço' };
  }
}