// App.js - VERSÃO CORRIGIDA COM HEADER PADRONIZADO
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import Login from './src/screens/Login';
import CadastroCliente from './src/screens/CadastroCliente';
import DashboardCliente from './src/screens/DashboardCliente';
import MinhasSolicitacoes from './src/screens/MinhasSolicitacoes';
import NovaSolicitacao from './src/screens/NovaSolicitacao';
import PerfilCliente from './src/screens/PerfilCliente';
import PropostasRecebidas from './src/screens/PropostasRecebidas';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Componente personalizado para o header "Chama Serviço"
const ChamaServicoHeader = () => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{
      color: '#f5a522',
      fontSize: 20,
      fontWeight: 'bold',
    }}>
      Chama Serviço
    </Text>
  </View>
);

// Configurações padrão do header para telas autenticadas
const authenticatedHeaderOptions = {
  headerStyle: { backgroundColor: '#0a112e' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
  headerTitle: () => <ChamaServicoHeader />,
};

// Stack para Solicitações
function SolicitacoesStack() {
  return (
    <Stack.Navigator screenOptions={authenticatedHeaderOptions}>
      <Stack.Screen
        name="MinhasSolicitacoes"
        component={MinhasSolicitacoes}
        options={{ title: 'Minhas Solicitações' }}
      />
      <Stack.Screen
        name="NovaSolicitacao"
        component={NovaSolicitacao}
      />
    </Stack.Navigator>
  );
}

// Stack para Dashboard
function DashStack() {
  return (
    <Stack.Navigator screenOptions={authenticatedHeaderOptions}>
      <Stack.Screen
        name="DashboardCliente"
        component={DashboardCliente}
      />
      <Stack.Screen
        name="PerfilCliente"
        component={PerfilCliente}
      />
    </Stack.Navigator>
  );
}

// Stack para Propostas
function PropostasStack() {
  return (
    <Stack.Navigator screenOptions={authenticatedHeaderOptions}>
      <Stack.Screen
        name="PropostasRecebidas"
        component={PropostasRecebidas}
      />
    </Stack.Navigator>
  );
}

// Stack principal que inclui todas as telas autenticadas
function MainStack() {
  return (
    <Stack.Navigator screenOptions={authenticatedHeaderOptions}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NovaSolicitacao"
        component={NovaSolicitacao}
      />
      <Stack.Screen
        name="PerfilCliente"
        component={PerfilCliente}
      />
    </Stack.Navigator>
  );
}

// Componente de abas principal
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Solicitacoes') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Propostas') {
            iconName = focused ? 'cash' : 'cash-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f5a522',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        ...authenticatedHeaderOptions, // Aplica o header padrão em todas as abas
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardCliente}
        options={{
          title: 'Início',
        }}
      />
      <Tab.Screen 
        name="Solicitacoes" 
        component={SolicitacoesStack}
        options={{ 
          headerShown: false,
          title: 'Solicitações'
        }}
      />
      <Tab.Screen 
        name="Propostas" 
        component={PropostasStack}
        options={{ 
          headerShown: false,
          title: 'Propostas'
        }}
      />
    </Tab.Navigator>
  );
}

// Rotas de autenticação (sem header "Chama Serviço")
function AuthRoutes() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadastroCliente" component={CadastroCliente} />
      {/* Adicionar NovaSolicitacao também nas rotas de auth para evitar erro de navegação */}
      {/* <Stack.Screen 
        name="NovaSolicitacao" 
        component={NovaSolicitacao} 
        options={{ 
          headerShown: true,
          title: 'Nova Solicitação',
          headerStyle: { backgroundColor: '#0a112e' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      /> */}
    </Stack.Navigator>
  );
}

// Componente que decide qual rota mostrar
function Rotas() {
  const { usuario, carregando } = useContext(AuthContext);

  if (carregando) return null;

  return usuario ? <MainStack /> : <AuthRoutes />;
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