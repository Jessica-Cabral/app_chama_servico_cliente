// API para gerenciar a autenticação dos cliente


//const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/auth.php';
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php';
//const { token } = useContext(AuthContext);

export async function autenticarCliente(email, senha,token) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { erro: 'Erro na requisição de autenticação' };
  }
}
