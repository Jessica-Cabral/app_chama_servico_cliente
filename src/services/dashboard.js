//
const API_URL =
  "https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php";

export async function carregarDadosDashboard(cliente_id, token) {
  try {
    console.log("Iniciando carregamento dos dados...");
    console.log("Cliente ID:", cliente_id);
    console.log("Token:", token ? "Presente" : "Ausente");

    //validando dados de entrada

    // if (!cliente_id || !token) {
    //   console.error(" Dados de autenticação ausentes");
    //   return {
    //     perfil: null,
    //     solicitacoes: [],
    //     propostas: [],
    //     erro: "Dados de autenticação ausentes",
    //   };
    // }

    //Quando usar o throw new error ou o console.error
    //throw
    // Usar throw new Error quando:
    // Condição inválida que impede continuidade
    // Erros de validação críticos
    // Recursos necessários não disponíveis

    //console
    //Logging para debugging
    // erro não-críticos (que não impedem continuidade)
    //quero apenas visualizar o erro. 
    //Testando throw 
    if (!cliente_id || !token) {
      // console.error("Dados de autenticação ausentes");
      throw new Error("Dados de autenticação ausentes");
    }

    // Fazer uma única requisição de teste primeiro
    const testResponse = await fetch(
      `${API_URL}/perfil?cliente_id=${cliente_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(" Status da resposta:", testResponse.status);
    // console.log(
    //   "URL da requisição:",
    //   `${API_URL}/perfil?cliente_id=${cliente_id}`
    // );
    //Trantado erros Http
    if (!testResponse.ok) {
      console.error("Erro HTTP:", testResponse.status);
      throw new Error(`Erro HTTP: ${testResponse.status}`);
    }

    const testData = await testResponse.json();
    // console.log("Dados brutos da API:", testData);

    // Se a API retornou um erro
    if (testData.erro) {
      console.error("Erro da API:", testData.erro);
      return {
        perfil: null,
        solicitacoes: [],
        propostas: [],
        erro: testData.erro,
      };
    }

    // Se a API retornou sucesso
    if (testData.sucesso) {
      // console.log("Dados carregados com sucesso");

      // Carregar outros dados em paralelo
      const [solicitacoesRes, propostasRes] = await Promise.all([
        fetch(`${API_URL}/solicitacoes?cliente_id=${cliente_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/propostas?cliente_id=${cliente_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const solicitacoesData = await solicitacoesRes.json();
      const propostasData = await propostasRes.json();

      // console.log("Dados das solicitações:", solicitacoesData);
      // console.log("Dados das propostas:", propostasData);

      return {
        perfil: testData.perfil || null,
        solicitacoes: solicitacoesData.sucesso
          ? solicitacoesData.solicitacoes
          : [],
        propostas: propostasData.sucesso ? propostasData.propostas : [],
        erro: null,
      };
    }
    return {
      perfil: null,
      solicitacoes: [],
      propostas: [],
      erro: "Estrutura de resposta inesperada da API",
    };
  } catch (error) {
    // console.error('Erro crítico ao carregar dados:', error);
    // console.error('Detalhes do erro:', error.message);

    return {
      perfil: null,
      solicitacoes: [],
      propostas: [],
      erro: error.message || "Erro de conexão com o servidor",
    };
  }
}
