import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons'; // Importação corrigida
import { AuthProvider } from './src/context/AuthContext';

import HomeScreen from './src/screens/HomeScreen';
import Login from './src/screens/Login';
import CadastroCliente from './src/screens/CadastroCliente';
import DashboardCliente from './src/screens/DashboardCliente';
import MinhasSolicitacoes from './src/screens/MinhasSolicitacoes';
import NovaSolicitacao from './src/screens/NovaSolicitacao';
import PerfilCliente from './src/screens/PerfilCliente';
import PropostasRecebidas from './src/screens/PropostasRecebidas';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Minhas Solicitações') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Nova Solicitação') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#283579',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardCliente} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Minhas Solicitações" 
        component={MinhasSolicitacoes} 
      />
      <Tab.Screen 
        name="Nova Solicitação" 
        component={NovaSolicitacao} 
      />
    </Tab.Navigator>
  );
}

function DrawerRoutes() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 240,
        },
        drawerActiveTintColor: '#283579',
        drawerInactiveTintColor: '#4e5264',
        drawerLabelStyle: {
          fontSize: 16,
        },
        headerShown: false, // Adicione esta linha
      }}
    >
      <Drawer.Screen 
        name="Início" 
        component={Tabs} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ) 
        }} 
      />
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilCliente} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ) 
        }} 
      />
      <Drawer.Screen 
        name="Propostas Recebidas" 
        component={PropostasRecebidas} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ) 
        }} 
      />
      <Drawer.Screen 
        name="Versão Web" 
        component={HomeScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="globe" size={size} color={color} />
          ) 
        }} 
      />
      <Drawer.Screen 
        name="Sair" 
        component={Login} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out" size={size} color={color} />
          ) 
        }} 
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <DrawerRoutes />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}