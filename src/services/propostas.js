//Api para gestão das propostas recebidas e aceitação
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/propostas.php';
const { token } = useContext(AuthContext);

export async function buscarPropostas(cliente_id, filtros = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cliente_id, ...filtros })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao buscar propostas' };
  }
}

export async function aceitarProposta(cliente_id, proposta_id) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cliente_id, proposta_id })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao aceitar proposta' };
  }
}