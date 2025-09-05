import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';


interface User {
  id: string;
  name: string;
  email: string;
  weight: number;
  height: number;
  age: number;
  role: string;
  interval: number;
  fileId?: string;
  subscriptionStatus?: string;
  createdAt: string;
  updatedAt: string;
}

interface PersonalDashboardProps {
  navigation: any;
}

export default function PersonalDashboard({ navigation }: PersonalDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const { token, user: currentUser } = useAuth();


  const [searchText, setSearchText] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [workoutFilter, setWorkoutFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const fetchUsers = async (resetCache = false) => {
    try {
      const url = resetCache ? '/user/all?resetCache=true' : '/user/all';
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers(true);
  };

  const handleEditWorkout = (user: User) => {
    navigation.navigate('EditWorkout', { user });
  };

  const assignPersonalRole = async (userId: string) => {
    try {
      await api.patch(`/user/assign-personal/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Sucesso', 'Cargo de personal trainer atribuído com sucesso!');
      fetchUsers();
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atribuir o cargo de personal trainer');
      console.error('Erro ao atribuir cargo:', error);
    }
  };

  const confirmAssignPersonal = (userId: string, userName: string) => {
    Alert.alert(
      'Confirmar',
      `Deseja subir os privilegios de ${userName} para personal ?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => assignPersonalRole(userId) }
      ]
    );
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Sucesso', 'Usuário deletado com sucesso!');
      fetchUsers();
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível deletar o usuário');
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const confirmDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja deletar o usuário ${userName}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: () => deleteUser(userId) }
      ]
    );
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email });
    setEditModalVisible(true);
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      await api.patch(`/user/update/${selectedUser.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      setEditModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar o usuário');
      console.error('Erro ao atualizar usuário:', error);
    }
  };


  const applyFilters = () => {
    let filtered = [...users];


    if (searchText.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }


    if (selectedRoles.length > 0) {
      filtered = filtered.filter(user => selectedRoles.includes(user.role));
    }


    if (workoutFilter === 'with') {
      filtered = filtered.filter(user => user.fileId);
    } else if (workoutFilter === 'without') {
      filtered = filtered.filter(user => !user.fileId);
    }


    if (paymentFilter === 'paid') {
      filtered = filtered.filter(user => user.subscriptionStatus === 'active');
    } else if (paymentFilter === 'unpaid') {
      filtered = filtered.filter(user => user.subscriptionStatus !== 'active');
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchText, selectedRoles, workoutFilter, paymentFilter]);


  const toggleRoleFilter = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const clearAllFilters = () => {
    setSearchText('');
    setSelectedRoles([]);
    setWorkoutFilter('all');
    setPaymentFilter('all');
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'canceled': return 'bg-red-500';
      case 'past_due': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadgeText = (status?: string) => {
    switch (status) {
      case 'active': return 'Pago';
      case 'inactive': return 'Inativo';
      case 'canceled': return 'Cancelado';
      case 'past_due': return 'Vencido';
      default: return 'Não definido';
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View className="bg-secondary rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">{item.name}</Text>
          <Text className="text-sm text-gray-400">{item.email}</Text>
          <View className="flex-row mt-2 flex-wrap">
            <View className="bg-cyan-500 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-xs text-white font-medium">{item.role}</Text>
            </View>
            {item.fileId ? (
              <View className="bg-tertiary px-2 py-1 rounded mr-2 mb-1">
                <Text className="text-xs text-primary font-medium">Com treino</Text>
              </View>
            ) : (
              <View className="bg-destructive px-2 py-1 rounded mr-2 mb-1">
                <Text className="text-xs text-white font-medium">Sem treino</Text>
              </View>
            )}
            <View className={`px-2 py-1 rounded mb-1 ${getStatusBadgeColor(item.subscriptionStatus)}`}>
              <Text className="text-xs font-medium text-white">
                {getStatusBadgeText(item.subscriptionStatus)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row">
          <View className="mr-4">
            <Text className="text-xs text-white">Peso</Text>
            <Text className="text-sm font-medium text-gray-400">{item.weight}kg</Text>
          </View>
          <View className="mr-4">
            <Text className="text-xs text-white">Altura</Text>
            <Text className="text-sm font-medium text-gray-400">{item.height}cm</Text>
          </View>
          <View>
            <Text className="text-xs text-white">Idade</Text>
            <Text className="text-sm font-medium text-gray-400">{item.age} anos</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => navigation.navigate('UserWorkoutDetails', { user: item })}
          className="bg-green-500 h-12 justify-center rounded-lg flex-row items-center flex-1 mr-2"
        >
          <Ionicons name="eye" size={16} color="white" />
          <Text className="text-white font-medium ml-2">Ver Detalhes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEditWorkout(item)}
          className="bg-blue-500 h-12 justify-center rounded-lg flex-row items-center flex-1 mr-2"
        >
          <Ionicons name="fitness" size={16} color="white" />
          <Text className="text-white font-medium ml-2">Editar Treino</Text>
        </TouchableOpacity>

        {isAdmin && (
          <>
            <TouchableOpacity
              onPress={() => openEditModal(item)}
              className="bg-yellow-500 w-12 h-12 justify-center rounded-lg flex-row items-center mr-2"
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => confirmDeleteUser(item.id, item.name)}
              className="bg-red-500 w-12 h-12 justify-center rounded-lg flex-row items-center mr-2"
            >
              <Ionicons name="trash" size={16} color="white" />
            </TouchableOpacity>
          </>
        )}

        {item.role === 'user' && (
          <TouchableOpacity
            onPress={() => confirmAssignPersonal(item.id, item.name)}
            className="bg-orange-500 w-14 h-12 justify-center rounded-lg flex-row items-center"
          >
            <Ionicons name="person-add" size={16} color="white" />
            <Text className="text-white font-medium ml-2">Up</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Carregando usuários...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1">
        <View className="bg-secondary px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Gerenciar Usuários</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <View className="flex-1 px-4 pt-4">
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-white">
                Usuários ({filteredUsers.length}/{users.length})
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setShowFilters(!showFilters)}
                  className="bg-blue-500 p-2 rounded-lg mr-2"
                >
                  <Ionicons name="filter" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onRefresh}
                  className="bg-cyan-500 p-2 rounded-lg"
                >
                  <Ionicons name="refresh" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {showFilters && (
              <View className="bg-secondary border border-gray-600 p-4 rounded-lg mb-3">
      
                <View className="mb-3">
                  <TextInput
                    placeholder="Pesquisar por nome ou email..."
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={setSearchText}
                    className="bg-primary text-white border border-gray-600 rounded-lg px-3 py-2"
                  />
                </View>

      
                <View className="mb-3">
                  <Text className="text-sm font-medium text-white mb-2">Tipo de usuário:</Text>
                  <View className="flex-row flex-wrap">
                    {['user', 'personal', 'admin'].map(role => (
                      <TouchableOpacity
                        key={role}
                        onPress={() => toggleRoleFilter(role)}
                        className={`px-3 py-1 rounded-full mr-2 mb-2 ${selectedRoles.includes(role) ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                      >
                        <Text className={`text-xs font-medium ${selectedRoles.includes(role) ? 'text-white' : 'text-gray-300'
                          }`}>
                          {role === 'admin' ? 'Admin' : role === 'personal' ? 'Personal' : 'Usuário'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

      
                <View className="mb-3">
                  <Text className="text-sm font-medium text-white mb-2">Status do treino:</Text>
                  <View className="flex-row">
                    {[{ key: 'all', label: 'Todos' }, { key: 'with', label: 'Com treino' }, { key: 'without', label: 'Sem treino' }].map(option => (
                      <TouchableOpacity
                        key={option.key}
                        onPress={() => setWorkoutFilter(option.key)}
                        className={`px-3 py-1 rounded-full mr-2 ${workoutFilter === option.key ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                      >
                        <Text className={`text-xs font-medium ${workoutFilter === option.key ? 'text-white' : 'text-gray-300'
                          }`}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

      
                <View className="mb-3">
                  <Text className="text-sm font-medium text-white mb-2">Status do pagamento:</Text>
                  <View className="flex-row">
                    {[{ key: 'all', label: 'Todos' }, { key: 'paid', label: 'Pago' }, { key: 'unpaid', label: 'Não pago' }].map(option => (
                      <TouchableOpacity
                        key={option.key}
                        onPress={() => setPaymentFilter(option.key)}
                        className={`px-3 py-1 rounded-full mr-2 ${paymentFilter === option.key ? 'bg-yellow-500' : 'bg-gray-600'
                          }`}
                      >
                        <Text className={`text-xs font-medium ${paymentFilter === option.key ? 'text-white' : 'text-gray-300'
                          }`}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

      
                <TouchableOpacity
                  onPress={clearAllFilters}
                  className="bg-red-500 p-2 rounded-lg"
                >
                  <Text className="text-white text-center font-medium">Limpar Filtros</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <Ionicons name="people-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-4">
                  Nenhum usuário encontrado
                </Text>
              </View>
            }
          />
        </View>
      </View>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-secondary rounded-lg p-6 w-80 mx-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-white">Editar Usuário</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-white mb-2">Nome:</Text>
              <TextInput
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                className="bg-primary text-white p-3 rounded-lg border border-gray-600"
                placeholder="Nome do usuário"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-6">
              <Text className="text-white mb-2">Email:</Text>
              <TextInput
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                className="bg-primary text-white p-3 rounded-lg border border-gray-600"
                placeholder="Email do usuário"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="bg-gray-600 px-6 py-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-white text-center font-medium">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={updateUser}
                className="bg-blue-500 px-6 py-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center font-medium">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}