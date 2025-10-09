// API para cadastro de cliente
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/cadastro.php';
const { token } = useContext(AuthContext);

export async function cadastrarCliente(nome, email, senha, confirmar_senha) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, email, senha, confirmar_senha })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro na requisição de cadastro' };
  }
}