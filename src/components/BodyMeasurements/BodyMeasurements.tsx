import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HumanBodySVG from './HumanBodySVG';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface BodyMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bicep: number;
  thigh: number;
  neck: number;
  updatedAt?: string;
}

interface BodyMeasurementsProps {
  userId?: string;
  editable?: boolean;
  onEdit?: (measurements: BodyMeasurements | null) => void;
  refreshTrigger?: number;
}

const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({
  userId,
  editable = false,
  onEdit,
  refreshTrigger
}) => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurements | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchMeasurements();
    } else {
      setMeasurements(null);
      setLoading(false);
    }
  }, [targetUserId, refreshTrigger]);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/measurements/${targetUserId}`);
      setMeasurements(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Usuário não tem medidas corporais cadastradas
        setMeasurements(null);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as medidas corporais');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: '#3B82F6' };
    if (bmi < 25) return { category: 'Peso normal', color: '#10B981' };
    if (bmi < 30) return { category: 'Sobrepeso', color: '#F59E0B' };
    return { category: 'Obesidade', color: '#EF4444' };
  };

  const measurementDetails = [
    { label: 'Altura', value: measurements?.height, unit: 'cm', icon: 'resize-outline' },
    { label: 'Peso', value: measurements?.weight, unit: 'kg', icon: 'fitness-outline' },
    { label: 'Peito', value: measurements?.chest, unit: 'cm', icon: 'body-outline' },
    { label: 'Cintura', value: measurements?.waist, unit: 'cm', icon: 'body-outline' },
    { label: 'Quadril', value: measurements?.hips, unit: 'cm', icon: 'body-outline' },
    { label: 'Bíceps', value: measurements?.bicep, unit: 'cm', icon: 'barbell-outline' },
    { label: 'Coxa', value: measurements?.thigh, unit: 'cm', icon: 'body-outline' },
    { label: 'Pescoço', value: measurements?.neck, unit: 'cm', icon: 'body-outline' },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="mt-4 text-lg text-muted-foreground">Carregando medidas...</Text>
      </View>
    );
  }

  if (!measurements) {
    return (
      <View className="flex-1 justify-center items-center bg-primary p-8">
        <Ionicons name="body-outline" size={80} color="#9CA3AF" />
        <Text className="text-2xl font-bold text-white mt-4 text-center">Nenhuma medida encontrada</Text>
        <Text className="text-lg text-muted-foreground mt-3 text-center leading-6">
          {editable ? 'Adicione suas medidas corporais' : 'Usuário ainda não possui medidas cadastradas'}
        </Text>
        {editable && onEdit && (
          <TouchableOpacity className="flex-row items-center bg-secondary px-6 py-4 rounded-lg mt-6" onPress={() => onEdit(null)}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
            <Text className="text-white text-lg font-semibold ml-3">Adicionar Medidas</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const bmi = calculateBMI(measurements.weight, measurements.height);
  const bmiInfo = getBMICategory(bmi);

  return (
    <ScrollView className="flex-1 bg-primary" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 h-20 bg-secondary rounded-t-lg border-b border-border">
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white">Medidas Corporais</Text>
          {measurements.updatedAt && (
            <Text className="text-sm text-muted-foreground mt-2">
              Última atualização: {new Date(measurements.updatedAt).toLocaleDateString('pt-BR')}
            </Text>
          )}
        </View>
        {editable && onEdit && (
          <TouchableOpacity className="p-3 rounded-lg bg-secondary" onPress={() => onEdit(measurements)}>
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* IMC Card */}
      <View className="bg-secondary m-6 p-6 rounded-xl shadow-lg">
        <View className="flex-row items-center mb-4">
          <Ionicons name="analytics-outline" size={28} color={bmiInfo.color} />
          <Text className="text-xl font-semibold text-white ml-3">Índice de Massa Corporal</Text>
        </View>
        <View className="items-center mb-4">
          <Text className="text-5xl font-bold" style={{ color: bmiInfo.color }}>
            {bmi.toFixed(1)}
          </Text>
          <Text className="text-xl font-semibold mt-2" style={{ color: bmiInfo.color }}>
            {bmiInfo.category}
          </Text>
        </View>

        {/* Altura e Peso */}
        <View className="flex-row justify-around pt-4 border-t border-border">
          <View className="items-center">
            <Ionicons name="resize-outline" size={24} color="#6B7280" />
            <Text className="text-lg font-semibold text-white mt-2">Altura</Text>
            <Text className="text-2xl font-bold text-gray-400">{measurements.height} cm</Text>
          </View>
          <View className="items-center">
            <Ionicons name="fitness-outline" size={24} color="#6B7280" />
            <Text className="text-lg font-semibold text-white mt-2">Peso</Text>
            <Text className="text-2xl font-bold text-gray-400">{measurements.weight} kg</Text>
          </View>
        </View>
      </View>

      {/* Visualização do Corpo */}
      <View className="bg-secondary m-6 mt-0 py-6 px-5 rounded-xl shadow-lg w-95%">
        <Text className="text-2xl font-bold text-white mb-6">Visualização Corporal</Text>
        <View className="items-center justify-center rounded-lg w-full">
          <HumanBodySVG
            measurements={measurements}
            width={300}
            height={500}
            showMeasurements={true}
          />
        </View>
      </View>

      {/* Toggle para detalhes */}
      <TouchableOpacity
        className="flex-row justify-center items-center bg-secondary mx-6 p-5 rounded-lg shadow-sm"
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text className="text-lg font-semibold text-white mr-3">
          {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes'}
        </Text>
        <Ionicons
          name={showDetails ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {/* Detalhes das medidas */}
      {showDetails && (
        <View className="bg-secondary m-6 mt-3 p-6 rounded-xl shadow-lg">
          <Text className="text-2xl font-bold text-white mb-6">Detalhes das Medidas</Text>
          {measurementDetails.map((item, index) => (
            <View key={index} className="flex-row justify-between items-center py-4 border-b border-border">
              <View className="flex-row items-center">
                <Ionicons name={item.icon as any} size={24} color="#6B7280" />
                <Text className="text-lg text-muted-foreground ml-4">{item.label}</Text>
              </View>
              <Text className="text-lg font-semibold text-white">
                {item.value} {item.unit}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};



export default BodyMeasurements;