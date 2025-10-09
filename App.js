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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para a aba "Serviços"
function ServicosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DashboardCliente" component={DashboardCliente} />
      {/* <Stack.Screen name="NovaSolicitacao" component={NovaSolicitacao} /> */}
      <Stack.Screen name="PropostasRecebidas" component={PropostasRecebidas} />
    </Stack.Navigator>
  );
}

// Stack para a aba "Perfil"
function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PerfilCliente" component={PerfilCliente} />
      <Stack.Screen name="CadastroCliente" component={CadastroCliente} />
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
    </Stack.Navigator>
  );
}


// Rotas principais com abas
function MainRoutes() {
  return (
    <Tab.Navigator initialRouteName="Serviços">
      <Tab.Screen name="Serviços" component={ServicosStack} options={{ headerShown: false }} />
      <Tab.Screen name="Minhas Solicitações" component={MinhasSolicitacoes} />
      <Tab.Screen name="Perfil" component={PerfilStack} options={{ headerShown: false }} />
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