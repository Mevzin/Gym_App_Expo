import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { EditUserWorkoutProps, User } from '../../types/navigation';



interface WorkoutFile {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}



export default function EditUserWorkout({ navigation, route }: EditUserWorkoutProps) {
  const { user } = route.params;
  const [workoutFiles, setWorkoutFiles] = useState<WorkoutFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>(user.fileId);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { token } = useAuth();

  const fetchWorkoutFiles = async () => {
    try {
      const response = await api.get('/files', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkoutFiles(response.data.files || []);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os arquivos de treino');
      console.error('Erro ao buscar arquivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserWorkout = async () => {
    if (!selectedFileId) {
      Alert.alert('Atenção', 'Selecione um arquivo de treino');
      return;
    }

    setUpdating(true);
    try {
      await api.patch(`/user/update-workout/${user.id}`, {
        fileId: selectedFileId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Alert.alert('Sucesso', 'Treino atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar o treino');
      console.error('Erro ao atualizar treino:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeWorkout = async () => {
    Alert.alert(
      'Confirmar',
      'Deseja remover o treino atual do usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setUpdating(true);
            try {
              await api.patch(`/user/update-workout/${user.id}`, {
                fileId: null
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

              setSelectedFileId(undefined);
              Alert.alert('Sucesso', 'Treino removido com sucesso!');
            } catch (error: any) {
              Alert.alert('Erro', 'Não foi possível remover o treino');
              console.error('Erro ao remover treino:', error);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchWorkoutFiles();
  }, []);

  const renderWorkoutFile = (file: WorkoutFile) => {
    const isSelected = selectedFileId === file._id;
    const isCurrent = user.fileId === file._id;

    return (
      <TouchableOpacity
        key={file._id}
        onPress={() => setSelectedFileId(file._id)}
        className={`p-4 rounded-lg border-2 mb-3 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className={`text-lg font-semibold ${isSelected ? 'text-blue-800' : 'text-gray-800'
              }`}>
              {file.name}
            </Text>
            {file.description && (
              <Text className="text-sm text-gray-600 mt-1">{file.description}</Text>
            )}
            <Text className="text-xs text-gray-500 mt-2">
              Criado em: {new Date(file.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <View className="ml-3">
            {isCurrent && (
              <View className="bg-green-100 px-2 py-1 rounded mb-2">
                <Text className="text-xs text-green-800 font-medium">Atual</Text>
              </View>
            )}
            {isSelected && (
              <Ionicons name="checkmark-circle" size={24} color={"bg-primary"} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={"bg-primary"} />
          <Text className="text-gray-600 mt-2">Carregando treinos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={"bg-primary"} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Editar Treino</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 pt-4">
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Usuário</Text>
            <Text className="text-base text-gray-700">{user.name}</Text>
            <Text className="text-sm text-gray-600">{user.email}</Text>
            <View className="flex-row mt-2">
              <Text className="text-sm text-gray-600 mr-4">Peso: {user.weight}kg</Text>
              <Text className="text-sm text-gray-600 mr-4">Altura: {user.height}cm</Text>
              <Text className="text-sm text-gray-600">Idade: {user.age} anos</Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Selecionar Treino ({workoutFiles.length} disponíveis)
            </Text>

            {workoutFiles.length === 0 ? (
              <View className="bg-white rounded-lg p-8 items-center">
                <Ionicons name="document-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-2">
                  Nenhum arquivo de treino disponível
                </Text>
              </View>
            ) : (
              workoutFiles.map(renderWorkoutFile)
            )}
          </View>

          {user.fileId && (
            <TouchableOpacity
              onPress={removeWorkout}
              disabled={updating}
              className="bg-red-500 p-4 rounded-lg mb-4 flex-row items-center justify-center"
            >
              {updating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="trash" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">Remover Treino Atual</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>

        <View className="bg-white px-4 py-3 border-t border-gray-200">
          <TouchableOpacity
            onPress={updateUserWorkout}
            disabled={updating || !selectedFileId}
            className={`p-4 rounded-lg flex-row items-center justify-center ${updating || !selectedFileId ? 'bg-gray-300' : 'bg-blue-500'
              }`}
          >
            {updating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Salvar Alterações</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}