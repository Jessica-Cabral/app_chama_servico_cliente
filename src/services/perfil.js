// API para consulta e atualização do perfil do cliente
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/Perfil.php';
const { token } = useContext(AuthContext);

export async function consultarPerfil(cliente_id) {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cliente_id })
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