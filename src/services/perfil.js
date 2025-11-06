// // API para consulta e atualização do perfil do cliente
const API_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/perfil';
const SENHA_URL = 'https://chamaservico.tds104-senac.online/api/cliente/ClienteApi.php/senha';

// Funções de máscara
export const masks = {
  cpf(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },

  data(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1');
  },

  telefone(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

// Funções de validação
export const validators = {
  cpf(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    return digito2 === parseInt(cpf.charAt(10));
  },

  data(data) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(data)) return false;

    const [dia, mes, ano] = data.split('/').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    
    return dataObj.getDate() === dia && 
           dataObj.getMonth() === mes - 1 && 
           dataObj.getFullYear() === ano &&
           dataObj <= new Date();
  }
};

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

    if (data.sucesso && data.perfil) {
      return data.perfil; // Retorna apenas o perfil
    } else if (data.nome) {
      return data; 
    } else {
      return { erro: data.erro || 'Perfil não encontrado' };
    }
  } catch (error) {
    return { erro: 'Erro ao consultar perfil' };
  }
}

export async function atualizarPerfil(cliente_id, nome, email, telefone, cpf, dt_nascimento, token) {
  try {
    console.log('Iniciando atualização do perfil...');
    
    // Preparar dados para envio
    const dadosParaEnviar = {
      cliente_id: parseInt(cliente_id),
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.replace(/\D/g, '') // Remove formatação do telefone
    };

    console.log('CPF recebido:', cpf);
    console.log('Data recebida:', dt_nascimento);

    // Só envia CPF se não foi preenchido anteriormente e está completo
    if (cpf && cpf.replace(/\D/g, '').length === 11) {
      const cpfLimpo = cpf.replace(/\D/g, '');
      console.log('CPF limpo para envio:', cpfLimpo);
      dadosParaEnviar.cpf = cpfLimpo;
    }

    // Só envia data se não foi preenchida anteriormente e está completa
    if (dt_nascimento && dt_nascimento.length === 10) {
      // Converter de DD/MM/AAAA para AAAA-MM-DD
      const [dia, mes, ano] = dt_nascimento.split('/');
      const dataFormatada = `${ano}-${mes}-${dia}`;
      dadosParaEnviar.dt_nascimento = dataFormatada;
    }

    // console.log('Dados finais para envio:', dadosParaEnviar);

    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosParaEnviar)
    });

    // console.log('Status da resposta:', response.status);
    
    const data = await response.json();
    // console.log('Resposta da API:', data);
    
    return data;
  } catch (error) {
    // console.error('Erro ao atualizar perfil:', error);
    return { erro: 'Erro ao conectar com o servidor: ' + error.message };
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

// Função auxiliar para formatar data
export function formatarDataParaExibicao(data) {
  if (!data) return '';
  
  // Se já estiver no formato DD/MM/AAAA, retorna como está
  if (data.includes('/')) {
    return data;
  }
  
  // Converte de YYYY-MM-DD para DD/MM/AAAA
  const partes = data.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  
  return data;
}