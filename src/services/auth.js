// API para gerenciar a autenticação dos cliente

const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/login';
//const { token } = useContext(AuthContext);

export async function autenticarCliente(email, senha) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro na requisição de autenticação' };
  }
}
