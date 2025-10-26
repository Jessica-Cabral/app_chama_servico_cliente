// API para gerenciamento de endereço

const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/perfil';
const ENDERECO_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/enderecos';

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

// export async function cadastrarEndereco(cliente_id, cep, numero, complemento, principal = false) {
//   try {
//     const response = await fetch(ENDERECO_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ cliente_id, cep, numero, complemento, principal })
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     return { erro: 'Erro ao cadastrar endereço' };
//   }
// }

// cadastro do endereço do cliente
export async function cadastrarEndereco(dados, token) {
  try {
    const response = await fetch(ENDERECO_URL, {
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
    console.error('Erro ao cadastrar endereço:', error);
    return { erro: 'Erro ao cadastrar endereço' };
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