import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { User } from '../../types/navigation';

interface UserWorkoutDetailsProps {
  navigation: any;
  route: {
    params: {
      user: User;
    };
  };
}

interface WorkoutData {
  [key: string]: string;
}

interface ExerciseGroup {
  name: string;
  exercises: {
    key: string;
    name: string;
    value: string;
    isConfigured: boolean;
  }[];
}

const exerciseGroups: ExerciseGroup[] = [
  {
    name: 'Pernas',
    exercises: [
      { key: 'agachamentoLivre', name: 'Agachamento Livre', value: '0x0', isConfigured: false },
      { key: 'agachamentoHack', name: 'Agachamento Hack', value: '0x0', isConfigured: false },
      { key: 'legPress', name: 'Leg Press', value: '0x0', isConfigured: false },
      { key: 'cadeiraExtensora', name: 'Cadeira Extensora', value: '0x0', isConfigured: false },
      { key: 'cadeiraFlexora', name: 'Cadeira Flexora', value: '0x0', isConfigured: false },
      { key: 'stiff', name: 'Stiff', value: '0x0', isConfigured: false },
      { key: 'afundo', name: 'Afundo', value: '0x0', isConfigured: false },
      { key: 'levantamentoTerra', name: 'Levantamento Terra', value: '0x0', isConfigured: false },
      { key: 'panturrilhaEmPe', name: 'Panturrilha em Pé', value: '0x0', isConfigured: false },
      { key: 'panturrilhaSentado', name: 'Panturrilha Sentado', value: '0x0', isConfigured: false },
    ]
  },
  {
    name: 'Braços',
    exercises: [
      { key: 'roscaDireta', name: 'Rosca Direta', value: '0x0', isConfigured: false },
      { key: 'roscaAlternada', name: 'Rosca Alternada', value: '0x0', isConfigured: false },
      { key: 'roscaMartelo', name: 'Rosca Martelo', value: '0x0', isConfigured: false },
      { key: 'roscaConcentrada', name: 'Rosca Concentrada', value: '0x0', isConfigured: false },
      { key: 'roscaScott', name: 'Rosca Scott', value: '0x0', isConfigured: false },
      { key: 'roscaInversa', name: 'Rosca Inversa', value: '0x0', isConfigured: false },
      { key: 'tricepsTesta', name: 'Tríceps Testa', value: '0x0', isConfigured: false },
      { key: 'tricepsFrances', name: 'Tríceps Francês', value: '0x0', isConfigured: false },
      { key: 'tricepsCorda', name: 'Tríceps Corda', value: '0x0', isConfigured: false },
      { key: 'tricepsBanco', name: 'Tríceps Banco', value: '0x0', isConfigured: false },
      { key: 'mergulhoNasParalelas', name: 'Mergulho nas Paralelas', value: '0x0', isConfigured: false },
    ]
  },
  {
    name: 'Peito',
    exercises: [
      { key: 'supinoReto', name: 'Supino Reto', value: '0x0', isConfigured: false },
      { key: 'supinoInclinado', name: 'Supino Inclinado', value: '0x0', isConfigured: false },
      { key: 'supinoDeclinado', name: 'Supino Declinado', value: '0x0', isConfigured: false },
      { key: 'crucifixoReto', name: 'Crucifixo Reto', value: '0x0', isConfigured: false },
      { key: 'crucifixoInclinado', name: 'Crucifixo Inclinado', value: '0x0', isConfigured: false },
      { key: 'crucifixoDeclinado', name: 'Crucifixo Declinado', value: '0x0', isConfigured: false },
      { key: 'peckDeck', name: 'Peck Deck', value: '0x0', isConfigured: false },
      { key: 'pullover', name: 'Pullover', value: '0x0', isConfigured: false },
      { key: 'flexaoDeBraco', name: 'Flexão de Braço', value: '0x0', isConfigured: false },
    ]
  },
  {
    name: 'Costas',
    exercises: [
      { key: 'puxadaAlta', name: 'Puxada Alta', value: '0x0', isConfigured: false },
      { key: 'puxadaFrente', name: 'Puxada Frente', value: '0x0', isConfigured: false },
      { key: 'puxadaAtras', name: 'Puxada Atrás', value: '0x0', isConfigured: false },
      { key: 'barraFixa', name: 'Barra Fixa', value: '0x0', isConfigured: false },
      { key: 'remadaCurvada', name: 'Remada Curvada', value: '0x0', isConfigured: false },
      { key: 'remadaUnilateral', name: 'Remada Unilateral', value: '0x0', isConfigured: false },
      { key: 'remadaBaixa', name: 'Remada Baixa', value: '0x0', isConfigured: false },
      { key: 'remadaCavalinho', name: 'Remada Cavalinho', value: '0x0', isConfigured: false },
      { key: 'levantamentoTerraCostas', name: 'Levantamento Terra Costas', value: '0x0', isConfigured: false },
    ]
  },
  {
    name: 'Ombros',
    exercises: [
      { key: 'desenvolvimentoHalteres', name: 'Desenvolvimento Halteres', value: '0x0', isConfigured: false },
      { key: 'desenvolvimentoBarra', name: 'Desenvolvimento Barra', value: '0x0', isConfigured: false },
      { key: 'elevacaoLateral', name: 'Elevação Lateral', value: '0x0', isConfigured: false },
      { key: 'elevacaoFrontal', name: 'Elevação Frontal', value: '0x0', isConfigured: false },
      { key: 'elevacaoPosterior', name: 'Elevação Posterior', value: '0x0', isConfigured: false },
      { key: 'encolhimentoOmbros', name: 'Encolhimento Ombros', value: '0x0', isConfigured: false },
      { key: 'arnoldPress', name: 'Arnold Press', value: '0x0', isConfigured: false },
    ]
  },
  {
    name: 'Abdômen',
    exercises: [
      { key: 'abdominalSupra', name: 'Abdominal Supra', value: '0x0', isConfigured: false },
      { key: 'abdominalInfra', name: 'Abdominal Infra', value: '0x0', isConfigured: false },
      { key: 'abdominalObliquo', name: 'Abdominal Oblíquo', value: '0x0', isConfigured: false },
      { key: 'prancha', name: 'Prancha', value: '0x0', isConfigured: false },
      { key: 'elevacaoDePernas', name: 'Elevação de Pernas', value: '0x0', isConfigured: false },
      { key: 'abWheel', name: 'Ab Wheel', value: '0x0', isConfigured: false },
      { key: 'bicicletaNoAr', name: 'Bicicleta no Ar', value: '0x0', isConfigured: false },
    ]
  }
];

export default function UserWorkoutDetails({ navigation, route }: UserWorkoutDetailsProps) {
  const { user } = route.params;
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exerciseGroupsData, setExerciseGroupsData] = useState<ExerciseGroup[]>(exerciseGroups);
  const [filter, setFilter] = useState<'all' | 'configured' | 'pending'>('all');
  const { token } = useAuth();

  const fetchUserWorkout = async () => {
    try {
      if (user.fileId) {
        const response = await api.get(`/files/getFileById/${user.fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWorkoutData(response.data.file);
        updateExerciseGroups(response.data.file);
      } else {
        setWorkoutData(null);
        updateExerciseGroups(null);
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do treino');
      console.error('Erro ao buscar treino:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseGroups = (data: WorkoutData | null) => {
    const updatedGroups = exerciseGroups.map(group => ({
      ...group,
      exercises: group.exercises.map(exercise => ({
        ...exercise,
        value: data ? data[exercise.key] || '0x0' : '0x0',
        isConfigured: data ? Boolean(data[exercise.key] && data[exercise.key] !== '0x0') : false
      }))
    }));
    setExerciseGroupsData(updatedGroups);
  };

  useEffect(() => {
    fetchUserWorkout();
  }, []);

  const renderExerciseItem = (exercise: any) => {
    const isConfigured = exercise.isConfigured;
    return (
      <View key={exercise.key} className={`p-3 mb-2 rounded-lg border ${
        isConfigured ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'
      }`}>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons 
                name={isConfigured ? 'checkmark-circle' : 'close-circle'} 
                size={16} 
                color={isConfigured ? '#10b981' : '#ef4444'} 
              />
              <Text className={`font-medium ml-2 ${
                isConfigured ? 'text-green-400' : 'text-red-400'
              }`}>
                {exercise.name}
              </Text>
            </View>
            <Text className={`text-sm ml-6 ${
              isConfigured ? 'text-green-300' : 'text-red-300'
            }`}>
              {isConfigured ? `Configurado: ${exercise.value}` : 'Não configurado'}
            </Text>
          </View>
          <View className={`px-2 py-1 rounded ${
            isConfigured ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Text className={`text-xs font-medium ${
              isConfigured ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConfigured ? '✓ Configurado' : '⚠ Pendente'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const getFilteredExercises = (exercises: any[]) => {
    switch (filter) {
      case 'configured':
        return exercises.filter(ex => ex.isConfigured);
      case 'pending':
        return exercises.filter(ex => !ex.isConfigured);
      default:
        return exercises;
    }
  };

  const renderExerciseGroup = (group: ExerciseGroup) => {
    const filteredExercises = getFilteredExercises(group.exercises);
    const configuredCount = group.exercises.filter(ex => ex.isConfigured).length;
    const totalCount = group.exercises.length;
    
    if (filteredExercises.length === 0) {
      return null;
    }
    
    return (
      <View key={group.name} className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-white">{group.name}</Text>
          <View className="bg-secondary px-3 py-1 rounded">
            <Text className="text-white text-sm font-medium">
              {configuredCount}/{totalCount}
            </Text>
          </View>
        </View>
        {filteredExercises.map(renderExerciseItem)}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-2">Carregando treino...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalExercises = exerciseGroupsData.reduce((acc, group) => acc + group.exercises.length, 0);
  const configuredExercises = exerciseGroupsData.reduce((acc, group) => 
    acc + group.exercises.filter(ex => ex.isConfigured).length, 0
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1">
        <View className="bg-secondary px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Treino do Usuário</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <View className="bg-secondary mx-4 mt-4 p-4 rounded-lg">
          <Text className="text-lg font-bold text-white">{user.name}</Text>
          <Text className="text-gray-300">{user.email}</Text>
          <View className="flex-row mt-2">
            <View className={`px-2 py-1 rounded mr-2 ${
              user.fileId ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <Text className="text-xs text-white font-medium">
                {user.fileId ? 'Com treino' : 'Sem treino'}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-secondary mx-4 mt-4 p-4 rounded-lg">
          <Text className="text-lg font-bold text-white mb-2">Progresso do Treino</Text>
          <View className="flex-row justify-between">
            <Text className="text-white">Exercícios configurados:</Text>
            <Text className="text-white font-bold">{configuredExercises}/{totalExercises}</Text>
          </View>
          <View className="bg-gray-700 h-2 rounded-full mt-2">
            <View 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${(configuredExercises / totalExercises) * 100}%` }}
            />
          </View>
        </View>

        <View className="mx-4 mt-4">
          <Text className="text-white font-medium mb-2">Filtrar exercícios:</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setFilter('all')}
              className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                filter === 'all' ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <Text className="text-white text-center font-medium">Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter('configured')}
              className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                filter === 'configured' ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <Text className="text-white text-center font-medium">Configurados</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter('pending')}
              className={`flex-1 py-2 px-3 rounded-lg ${
                filter === 'pending' ? 'bg-red-500' : 'bg-gray-600'
              }`}
            >
              <Text className="text-white text-center font-medium">Pendentes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {exerciseGroupsData.map(renderExerciseGroup)}
          <View className="h-4" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}