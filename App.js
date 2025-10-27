// App.js - VERSÃO CORRIGIDA
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

import HomeScreen from './src/screens/HomeScreen';
import Login from './src/screens/Login';
import CadastroCliente from './src/screens/CadastroCliente';
import DashboardCliente from './src/screens/DashboardCliente';
import MinhasSolicitacoes from './src/screens/MinhasSolicitacoes';
import NovaSolicitacao from './src/screens/NovaSolicitacao';
import PerfilCliente from './src/screens/PerfilCliente';
import PropostasRecebidas from './src/screens/PropostasRecebidas';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para Solicitações (inclui MinhasSolicitacoes e NovaSolicitacao)
function SolicitacoesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0a112e' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="MinhasSolicitacoes"
        component={MinhasSolicitacoes}
        options={{ title: 'Minhas Solicitações' }}
      />
      <Stack.Screen
        name="NovaSolicitacao"
        component={NovaSolicitacao}
        options={{ title: 'Nova Solicitação' }}
      />
    </Stack.Navigator>
  );
}

// Stack para Dashboard
function DashStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0a112e' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="DashboardCliente"
        component={DashboardCliente}
        options={{ title: 'Dashboard Cliente' }}
      />
      <Stack.Screen
        name="PerfilCliente"
        component={PerfilCliente}
        options={{ title: 'Perfil do Cliente' }}
      />
    </Stack.Navigator>
  );
}

// Stack para Propostas
function PropostasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0a112e' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="PropostasRecebidas"
        component={PropostasRecebidas}
        options={{ title: 'Propostas Recebidas' }}
      />
    </Stack.Navigator>
  );
}

// Rotas principais com abas - VERSÃO CORRIGIDA
function MainRoutes() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Solicitações') {
            iconName = 'document-text-outline';
          } else if (route.name === 'Propostas') {
            iconName = 'cash-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashStack} options={{ headerShown: false }} />
      <Tab.Screen name="Solicitações" component={SolicitacoesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Propostas" component={PropostasStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Rotas de autenticação (sem abas)
function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadastroCliente" component={CadastroCliente} />
    </Stack.Navigator>
  );
}

// Componente que decide qual rota mostrar
function Rotas() {
  const { usuario, carregando } = useContext(AuthContext);

  if (carregando) return null;

  return usuario ? <MainRoutes /> : <AuthRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Rotas />
      </NavigationContainer>
    </AuthProvider>
  );
}