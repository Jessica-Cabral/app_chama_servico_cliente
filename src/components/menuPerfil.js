// MenuPerfil.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const MenuPerfil = ({ visible, onClose, navigation }) => {
  const { usuario, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          onPress: () => {
            logout();
            onClose();
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, danger = false }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
    >
      <Ionicons 
        name={icon} 
        size={22} 
        color={danger ? '#ff6b6b' : '#283579'} 
        style={styles.menuIcon} 
      />
      <Text style={[styles.menuText, danger && styles.menuTextDanger]}>
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#4e5264" />
    </TouchableOpacity>
  );

  const obterIniciaisNome = (nome) => {
    return nome ? nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CL';
  };

  // Se não estiver visível, não renderiza nada
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity 
            activeOpacity={1}
            style={styles.container}
            onPress={(e) => e.stopPropagation()} // Impede que o clique dentro feche o modal
          >
            {/* Header do Menu */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Menu do Perfil</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#4e5264" />
              </TouchableOpacity>
            </View>

            {/* Informações do Usuário */}
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {obterIniciaisNome(usuario?.nome)}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{usuario?.nome || 'Cliente'}</Text>
                <Text style={styles.userEmail}>{usuario?.email || ''}</Text>
              </View>
            </View>

            {/* Seção: Perfil */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Minha Conta</Text>
              <MenuItem
                icon="person-outline"
                title="Ver Perfil"
                onPress={() => {
                  navigation.navigate('Perfil');
                  onClose();
                }}
              />
             <MenuItem
                icon="globe-outline"
                title="Versão Web"
                onPress={() => {
                  Alert.alert('Versão Web', 'Acesse: chamaservico.tds104-senac.online');
                  onClose();
                }}
              />
              <MenuItem
                icon="log-out-outline"
                title="Sair"
                onPress={handleLogout}
                danger={true}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    marginTop: 50,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a112e',
  },
  closeButton: {
    padding: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5a522',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a112e',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#4e5264',
  },
  menuSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4e5264',
    marginBottom: 8,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuIcon: {
    marginRight: 12,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#0a112e',
  },
  menuTextDanger: {
    color: '#ff6b6b',
  },
});

export default MenuPerfil;