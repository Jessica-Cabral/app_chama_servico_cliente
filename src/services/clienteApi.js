// import axios from 'axios';

// const API_URL = 'https://chamaservico.tds104-senac.online';
// const TOKEN = '781e5e245d69b566979b86e28d23f2c7';

// const clienteApi = {
//   buscarPerfil: async (clienteId) => {
//     try {
//       const response = await axios.get(`${API_URL}/cliente/perfil?cliente_id=${clienteId}`, {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao buscar perfil:', error);
//       return { erro: 'Erro ao buscar perfil' };
//     }
//   },

//   atualizarPerfil: async (clienteId, dados) => {
//     try {
//       const response = await axios.put(`${API_URL}/cliente/perfil`, {
//         cliente_id: clienteId,
//         ...dados,
//       }, {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao atualizar perfil:', error);
//       return { erro: 'Erro ao atualizar perfil' };
//     }
//   },

//   alterarSenha: async (clienteId, novaSenha) => {
//     try {
//       const response = await axios.put(`${API_URL}/auth`, {
//         cliente_id: clienteId,
//         nova_senha: novaSenha,
//       }, {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao alterar senha:', error);
//       return { erro: 'Erro ao alterar senha' };
//     }
//   },

//   adicionarEndereco: async (clienteId, endereco) => {
//     try {
//       const response = await axios.post(`${API_URL}/cliente/enderecos`, {
//         cliente_id: clienteId,
//         ...endereco,
//       }, {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao adicionar endereço:', error);
//       return { erro: 'Erro ao adicionar endereço' };
//     }
//   },

//   excluirEndereco: async (clienteId, enderecoId) => {
//     try {
//       const response = await axios.delete(`${API_URL}/cliente/enderecos`, {
//         data: {
//           cliente_id: clienteId,
//           endereco_id: enderecoId,
//         },
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao excluir endereço:', error);
//       return { erro: 'Erro ao excluir endereço' };
//     }
//   },
// };

// export default clienteApi;
