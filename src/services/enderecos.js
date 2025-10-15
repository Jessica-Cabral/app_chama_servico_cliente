// API para gerenciamento de endereço

//const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/enderecos.php';
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/perfil';

//const { token } = useContext(AuthContext);

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


export async function cadastrarEndereco(cliente_id, cep, numero, complemento, principal = false) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cliente_id, cep, numero, complemento, principal })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao cadastrar endereço' };
  }
}

export async function definirEnderecoPrincipal(cliente_id, endereco_id) {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cliente_id, endereco_id })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao definir endereço principal' };
  }
}

export async function excluirEndereco(cliente_id, endereco_id) {
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cliente_id, endereco_id })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao excluir endereço' };
  }
}