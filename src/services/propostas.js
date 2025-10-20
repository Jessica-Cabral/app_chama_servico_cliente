// services/propostas.js
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php';

export async function buscarPropostas(cliente_id, filtros = {}) {
  try {
    // Construir query string para filtros
    const params = new URLSearchParams({
      cliente_id: cliente_id.toString(),
      ...filtros
    });

    const response = await fetch(`${API_URL}/propostas?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 781e5e245d69b566979b86e28d23f2c7'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    return { erro: 'Erro ao buscar propostas' };
  }
}

export async function aceitarProposta(cliente_id, proposta_id) {
  try {
    const response = await fetch(`${API_URL}/aceitar-proposta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 781e5e245d69b566979b86e28d23f2c7'
      },
      body: JSON.stringify({ 
        cliente_id: cliente_id.toString(),
        proposta_id: proposta_id.toString()
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao aceitar proposta:', error);
    return { erro: 'Erro ao aceitar proposta' };
  }
}

export async function recusarProposta(cliente_id, proposta_id, motivo = '') {
  try {
    console.log('Enviando recusa para API:', { cliente_id, proposta_id, motivo });
    
    const response = await fetch(`${API_URL}/recusar-proposta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 781e5e245d69b566979b86e28d23f2c7'
      },
      body: JSON.stringify({ 
        cliente_id: cliente_id.toString(),
        proposta_id: proposta_id.toString(),
        motivo: motivo
      })
    });

    const data = await response.json();
    console.log('Resposta da API para recusa:', data);
    return data;
  } catch (error) {
    console.error('Erro ao recusar proposta:', error);
    return { erro: 'Erro ao recusar proposta' };
  }
}