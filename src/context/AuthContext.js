// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('usuario');
        if (dadosSalvos) {
          try {
            const usuarioParse = JSON.parse(dadosSalvos);
            setUsuario(usuarioParse);
          } catch (e) {
            console.error('Erro ao fazer parse dos dados do usuário:', e);
            await AsyncStorage.removeItem('usuario'); // limpa dados corrompidos
          }
        }
        
        // Token fixo
        const tokenFixo = '781e5e245d69b566979b86e28d23f2c7';
        setToken(tokenFixo);


      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        await AsyncStorage.removeItem('usuario'); 
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const login = async (dadosUsuario) => {
    try {
      await AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));
      setUsuario(dadosUsuario);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      setUsuario(null);
    } catch (error) {
      console.error('Erro ao remover dados do usuário:', error);
    }
  };

  
const atualizarUsuario = async (novosDados) => {
    try {
      const dadosAtualizados = { ...usuario, ...novosDados };
      await AsyncStorage.setItem('usuario', JSON.stringify(dadosAtualizados));
      setUsuario(dadosAtualizados);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };


  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando,token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};