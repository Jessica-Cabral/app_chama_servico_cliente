
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Importar telas
import TelaInicial from './src/telas/TelaInicial';
import TelaLogin from './src/telas/TelaLogin';
import TelaCadastro from './src/telas/TelaCadastro';
import TelaDashboardCliente from './src/telas/TelaDashboardCliente';
import TelaNovaSolicitacao from './src/telas/TelaNovaSolicitacao';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="TelaInicial"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        <Stack.Screen name="TelaLogin" component={TelaLogin} />
        <Stack.Screen name="TelaCadastro" component={TelaCadastro} />
        <Stack.Screen name="TelaSelecionarPerfil" component={TelaSelecionarPerfil} options={{
            title: "API Autor",
            headerStyle: {
              backgroundColor: "#00AD98",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }} />
        <Stack.Screen name="TelaDashboardCliente" component={TelaDashboardCliente} />
        <Stack.Screen name="TelaDashboardPrestador" component={TelaDashboardPrestador} />
        <Stack.Screen name="TelaNovaSolicitacao" component={TelaNovaSolicitacao} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}