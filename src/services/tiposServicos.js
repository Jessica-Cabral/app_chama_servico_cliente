//API para listagem do tipo de serviço

const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/tipos_servicos.php';
const { token } = useContext(AuthContext);

export async function listarTiposServicos() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro ao buscar tipos de serviço' };
  }
}