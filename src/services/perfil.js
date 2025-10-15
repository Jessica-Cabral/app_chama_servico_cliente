// API para consulta e atualização do perfil do cliente
//const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/Perfil.php';
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/perfil';

//const { token } = useContext(AuthContext);

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
    return data;
  } catch (error) {
    return { erro: 'Erro ao consultar perfil' };
  }
}

export async function atualizarPerfil(cliente_id, nome, email, telefone, cpf, dt_nascimento) {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cliente_id, nome, email, telefone, cpf, dt_nascimento })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao atualizar perfil' };
  }
}