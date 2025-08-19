import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';

// Importar telas
import TelaInicial from './src/telas/TelaInicial';
import TelaLogin from './src/telas/TelaLogin';
import TelaCadastro from './src/telas/TelaCadastro';
import TelaDashboardCliente from './src/telas/TelaDashboardCliente';
import TelaNovaSolicitacao from './src/telas/TelaNovaSolicitacao';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: '#0a112e',
          primary: '#f5a522',
          card: '#283579',
          text: '#ffffff',
          border: '#4e5264',
          notification: '#f5a522',
        },
      }}
    >
      <StatusBar style="light" backgroundColor="#0a112e" />
      <Drawer.Navigator
        initialRouteName="TelaInicial"
        screenOptions={{
          headerStyle: { backgroundColor: '#283579' },
          headerTintColor: '#ffffff',
          drawerStyle: { backgroundColor: '#0a112e' },
          drawerActiveTintColor: '#f5a522',
          drawerInactiveTintColor: '#ffffff',
          drawerLabelStyle: { fontWeight: 'bold' },
        }}
      >
        <Drawer.Screen name="TelaInicial" component={TelaInicial} options={{ title: 'Início' }} />
        <Drawer.Screen name="TelaLogin" component={TelaLogin} options={{ title: 'Login' }} />
        <Drawer.Screen name="TelaCadastro" component={TelaCadastro} options={{ title: 'Cadastro' }} />
        <Drawer.Screen name="TelaDashboardCliente" component={TelaDashboardCliente} options={{ title: 'Dashboard Cliente' }} />
        <Drawer.Screen name="TelaNovaSolicitacao" component={TelaNovaSolicitacao} options={{ title: 'Nova Solicitação' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}