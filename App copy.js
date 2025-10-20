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
const { MaterialIcons } = require('@expo/vector-icons');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para a aba "Serviços"
function DashStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1976D2' }, // cor de fundo do header
        headerTintColor: '#fff', // cor do texto/título
        headerTitleAlign: 'center', // centraliza o título
      }}
    >
      <Stack.Screen
        name="DashboardCliente"
        component={DashboardCliente}
        options={{ title: 'Dashboard Cliente' }}
      />
      <Stack.Screen
        name="PropostasRecebidas"
        component={PropostasRecebidas}
        options={{ title: 'Propostas Recebidas' }}
      />
      <Stack.Screen
        name="NovaSolicitacao"
        component={NovaSolicitacao}
        options={{ title: 'Nova Solicitacao' }}
      />
      <Stack.Screen
        name="PerfilCliente"
        component={PerfilCliente}
        options={{ title: 'PerfilCliente' }}
      />
    </Stack.Navigator>
  );
}

// Stack para a aba "Perfil"
function NovoServicoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NovaSolicitacao" component={NovaSolicitacao} />
      <Stack.Screen name="CadastroCliente" component={CadastroCliente} />
      <Stack.Screen name="PerfilCliente" component={PerfilCliente} />
    </Stack.Navigator>
  );
}

// Rotas de autenticação (sem abas)
function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadastroCliente" component={CadastroCliente} />
      <Stack.Screen name="NovaSolicitacao" component={NovaSolicitacao} />
      <Stack.Screen name="DashboardCliente" component={DashboardCliente} />
    </Stack.Navigator>
  );
}


// Rotas principais com abas
function MainRoutes() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Minhas Solicitações') {
            iconName = 'list-alt';
          } else if (route.name === 'Nova Solicitação') {
            iconName = 'add-circle-outline';
          }

          // Usando MaterialIcons do @expo/vector-icons
          // Certifique-se de instalar: expo install @expo/vector-icons
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashStack} options={{ headerShown: false }} />
      <Tab.Screen name="Minhas Solicitações" component={MinhasSolicitacoes} />
      <Tab.Screen name="Nova Solicitação" component={NovoServicoStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Componente que decide qual rota mostrar
function Rotas() {
  const { usuario, carregando } = useContext(AuthContext);

  if (carregando) return null; // ou um componente de loading

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