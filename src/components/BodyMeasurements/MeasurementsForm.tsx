import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface MeasurementsFormData {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  bicep: string;
  thigh: string;
  neck: string;
}

interface MeasurementsFormProps {
  userId?: string;
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

const MeasurementsForm: React.FC<MeasurementsFormProps> = ({
  userId,
  initialData,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<MeasurementsFormData>({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    bicep: '',
    thigh: '',
    neck: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<MeasurementsFormData>>({});

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (initialData) {
      setFormData({
        height: initialData.height?.toString() || '',
        weight: initialData.weight?.toString() || '',
        chest: initialData.chest?.toString() || '',
        waist: initialData.waist?.toString() || '',
        hips: initialData.hips?.toString() || '',
        bicep: initialData.bicep?.toString() || '',
        thigh: initialData.thigh?.toString() || '',
        neck: initialData.neck?.toString() || '',
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<MeasurementsFormData> = {};

    if (!formData.height || isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
      newErrors.height = 'Altura deve ser um número válido';
    }

    if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Peso deve ser um número válido';
    }

    if (!formData.chest || isNaN(Number(formData.chest)) || Number(formData.chest) <= 0) {
      newErrors.chest = 'Peito deve ser um número válido';
    }

    if (!formData.waist || isNaN(Number(formData.waist)) || Number(formData.waist) <= 0) {
      newErrors.waist = 'Cintura deve ser um número válido';
    }

    if (!formData.hips || isNaN(Number(formData.hips)) || Number(formData.hips) <= 0) {
      newErrors.hips = 'Quadril deve ser um número válido';
    }

    if (!formData.bicep || isNaN(Number(formData.bicep)) || Number(formData.bicep) <= 0) {
      newErrors.bicep = 'Bíceps deve ser um número válido';
    }

    if (!formData.thigh || isNaN(Number(formData.thigh)) || Number(formData.thigh) <= 0) {
      newErrors.thigh = 'Coxa deve ser um número válido';
    }

    if (!formData.neck || isNaN(Number(formData.neck)) || Number(formData.neck) <= 0) {
      newErrors.neck = 'Pescoço deve ser um número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!targetUserId) {
      Alert.alert('Erro', 'Usuário não está logado');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os campos inválidos');
      return;
    }

    try {
      setLoading(true);

      const measurementsData = {
        height: Number(formData.height),
        weight: Number(formData.weight),
        chest: Number(formData.chest),
        waist: Number(formData.waist),
        hips: Number(formData.hips),
        bicep: Number(formData.bicep),
        thigh: Number(formData.thigh),
        neck: Number(formData.neck),
      };

      const response = await api.put(`/user/measurements/${targetUserId}`, measurementsData);

      Alert.alert('Sucesso', 'Medidas atualizadas com sucesso!');

      if (onSave) {
        onSave(response.data.measurements);
      }
    } catch (error: any) {
      console.error('Erro ao salvar medidas:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível salvar as medidas'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof MeasurementsFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formFields = [
    { key: 'height' as keyof MeasurementsFormData, label: 'Altura', unit: 'cm', icon: 'resize-outline' },
    { key: 'weight' as keyof MeasurementsFormData, label: 'Peso', unit: 'kg', icon: 'fitness-outline' },
    { key: 'chest' as keyof MeasurementsFormData, label: 'Peito', unit: 'cm', icon: 'body-outline' },
    { key: 'waist' as keyof MeasurementsFormData, label: 'Cintura', unit: 'cm', icon: 'body-outline' },
    { key: 'hips' as keyof MeasurementsFormData, label: 'Quadril', unit: 'cm', icon: 'body-outline' },
    { key: 'bicep' as keyof MeasurementsFormData, label: 'Bíceps', unit: 'cm', icon: 'barbell-outline' },
    { key: 'thigh' as keyof MeasurementsFormData, label: 'Coxa', unit: 'cm', icon: 'body-outline' },
    { key: 'neck' as keyof MeasurementsFormData, label: 'Pescoço', unit: 'cm', icon: 'body-outline' },
  ];

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-primary" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center p-5 bg-secondary border-b border-gray-200">
          <View className="flex-row items-center">
            <Ionicons name="body-outline" size={28} color="#3B82F6" />
            <Text className="text-2xl font-bold text-white ml-3">Medidas Corporais</Text>
          </View>
          {onCancel && (
            <TouchableOpacity className="p-2 rounded-lg bg-gray-100" onPress={onCancel}>
              <Ionicons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <View className="p-5 bg-primary">
          {formFields.map((field, index) => (
            <View key={field.key} className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Ionicons name={field.icon as any} size={24} color="#a9a9a9" />
                  <Text className="text-lg font-semibold text-gray-400 ml-2">{field.label}</Text>
                </View>
                <Text className="text-base text-gray-500 font-medium">{field.unit}</Text>
              </View>

              <TextInput
                className={`bg-secondary placeholder:text-gray-400 border rounded-lg px-4 py-3 text-lg text-gray-400 ${errors[field.key] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                value={formData[field.key]}
                onChangeText={(value) => updateField(field.key, value)}
                placeholder={`Digite ${field.label.toLowerCase()}`}
                keyboardType="numeric"
                returnKeyType={index === formFields.length - 1 ? 'done' : 'next'}
              />

              {errors[field.key] && (
                <Text className="text-sm text-red-500 mt-1 ml-1">{errors[field.key]}</Text>
              )}
            </View>
          ))}
        </View>

        <View className="bg-secondary mb-5 mx-5 p-4 rounded-xl border-l-4 border-blue-500">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
            <Text className="text-base font-semibold text-blue-800 ml-2">Dicas para Medição</Text>
          </View>
          <Text className="text-sm text-blue-400 leading-5">
            • Meça sempre no mesmo horário do dia{"\n"}
            • Use uma fita métrica flexível{"\n"}
            • Mantenha a fita firme, mas não apertada{"\n"}
            • Respire normalmente durante a medição{"\n"}
            • Para melhores resultados, peça ajuda a alguém
          </Text>
        </View>
      </ScrollView>

      <View className="flex-row p-5 bg-secondary border-t border-gray-200 gap-3">
        {onCancel && (
          <TouchableOpacity
            className="flex-1 flex-row justify-center items-center py-3 rounded-lg bg-gray-100 border border-gray-300"
            onPress={onCancel}
            disabled={loading}
          >
            <Text className="text-lg font-semibold text-gray-600">Cancelar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className={`flex-1 flex-row justify-center items-center py-3 rounded-lg bg-blue-600 gap-2 ${loading ? 'opacity-60' : ''
            }`}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          )}
          <Text className="text-lg font-semibold text-white">
            {loading ? 'Salvando...' : 'Salvar Medidas'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};



export default MeasurementsForm;