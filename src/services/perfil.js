// API para consulta e atualização do perfil do cliente
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/perfil';
const SENHA_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/senha';

export async function consultarPerfil(cliente_id, token) {
  try {
    const response = await fetch(`${API_URL}?cliente_id=${cliente_id}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();
    
    // Verificar se a resposta tem a estrutura esperada
    if (data.sucesso && data.perfil) {
      return data.perfil; // Retorna apenas o perfil
    } else if (data.nome) {
      return data; // Já é o objeto do perfil
    } else {
      return { erro: data.erro || 'Perfil não encontrado' };
    }
  } catch (error) {
    return { erro: 'Erro ao consultar perfil' };
  }
}

export async function atualizarPerfil(cliente_id, nome, email, telefone, cpf, dt_nascimento, token) {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        cliente_id, 
        nome, 
        email, 
        telefone, 
        cpf, 
        dt_nascimento 
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao atualizar perfil' };
  }
}

export async function alterarSenha(cliente_id, senha_atual, nova_senha, token) {
  try {
    const response = await fetch(SENHA_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        cliente_id,
        senha_atual,
        nova_senha
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao alterar senha' };
  }
}