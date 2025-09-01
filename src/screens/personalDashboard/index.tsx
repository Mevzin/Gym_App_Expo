import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
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
  createdAt: string;
  updatedAt: string;
}

interface PersonalDashboardProps {
  navigation: any;
}

export default function PersonalDashboard({ navigation }: PersonalDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.users);
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
    fetchUsers();
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUserItem = ({ item }: { item: User }) => (
    <View className="bg-secondary rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">{item.name}</Text>
          <Text className="text-sm text-gray-400">{item.email}</Text>
          <View className="flex-row mt-2">
            <View className="bg-cyan-500 px-2 py-1 rounded mr-2">
              <Text className="text-xs text-white font-medium">{item.role}</Text>
            </View>
            {item.fileId ? (
              <View className="bg-tertiary px-2 py-1 rounded">
                <Text className="text-xs text-primary font-medium">Com treino</Text>
              </View>
            ) : (
              <View className="bg-destructive px-2 py-1 rounded">
                <Text className="text-xs text-white font-medium">Sem treino</Text>
              </View>
            )}
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
          className="bg-green-500 w-45% h-12 justify-center rounded-lg flex-row items-center flex-1 mr-2"
        >
          <Ionicons name="eye" size={16} color="white" />
          <Text className="text-white font-medium ml-2">Ver Detalhes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEditWorkout(item)}
          className="bg-blue-500 w-45% h-12 justify-center rounded-lg flex-row items-center flex-1 mr-2"
        >
          <Ionicons name="fitness" size={16} color="white" />
          <Text className="text-white font-medium ml-2">Editar Treino</Text>
        </TouchableOpacity>

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
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-white">
              Total: {users.length} usuários
            </Text>
            <TouchableOpacity onPress={onRefresh} className="p-2">
              <Ionicons name="refresh" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={users}
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
    </SafeAreaView>
  );
}