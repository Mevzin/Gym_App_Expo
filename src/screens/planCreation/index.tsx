import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { logger } from '../../utils/logger';
import { isValidPrice } from '../../utils/priceUtils';

interface Plan {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

export default function PlanCreation() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan>({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    features: [''],
    isActive: true
  });


  useEffect(() => {
    if (!user || user.role !== 'admin') {
      Alert.alert(
        'Acesso Negado',
        'Apenas administradores podem acessar esta tela.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [user, navigation]);

  const addFeature = () => {
    setPlan(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const validateForm = (): boolean => {
    if (!plan.name.trim()) {
      Alert.alert('Erro', 'Nome do plano é obrigatório');
      return false;
    }
    if (!plan.description.trim()) {
      Alert.alert('Erro', 'Descrição do plano é obrigatória');
      return false;
    }
    if (!isValidPrice(plan.price)) {
      Alert.alert('Erro', 'Preço deve ser um valor válido maior que zero');
      return false;
    }
    if (plan.duration <= 0) {
      Alert.alert('Erro', 'Duração deve ser maior que zero');
      return false;
    }
    if (plan.features.filter(f => f.trim()).length === 0) {
      Alert.alert('Erro', 'Pelo menos uma funcionalidade deve ser adicionada');
      return false;
    }
    return true;
  };

  const handleSavePlan = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const planData = {
        ...plan,
        features: plan.features.filter(f => f.trim())
      };

      const response = await api.post('/payment/plans', planData);
      
      Alert.alert(
        'Sucesso',
        'Plano criado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      logger.error('Erro ao criar plano:', error);
      Alert.alert('Erro', 'Não foi possível criar o plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="flex-row items-center justify-between p-4 bg-primary">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold font-roboto">Criar Plano</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 bg-primary p-4">
        <View className="space-y-4">
  
          <View>
            <Text className="text-white text-lg font-bold mb-2 font-roboto">Nome do Plano</Text>
            <TextInput
              className="bg-secondary text-white p-4 rounded-lg font-roboto"
              placeholder="Ex: Plano Premium"
              placeholderTextColor="#666"
              value={plan.name}
              onChangeText={(text) => setPlan(prev => ({ ...prev, name: text }))}
            />
          </View>

  
          <View>
            <Text className="text-white text-lg font-bold mb-2 font-roboto">Descrição</Text>
            <TextInput
              className="bg-secondary text-white p-4 rounded-lg font-roboto"
              placeholder="Descreva os benefícios do plano..."
              placeholderTextColor="#666"
              value={plan.description}
              onChangeText={(text) => setPlan(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

  
          <View>
            <Text className="text-white text-lg font-bold mb-2 font-roboto">Preço (R$)</Text>
            <TextInput
              className="bg-secondary text-white p-4 rounded-lg font-roboto"
              placeholder="0.00"
              placeholderTextColor="#666"
              value={plan.price.toString()}
              onChangeText={(text) => {
      
                const cleanText = text.replace(/[^0-9.,]/g, '').replace(',', '.');
                const numericValue = parseFloat(cleanText) || 0;
                setPlan(prev => ({ ...prev, price: numericValue }));
              }}
              keyboardType="numeric"
            />
          </View>

  
          <View>
            <Text className="text-white text-lg font-bold mb-2 font-roboto">Duração (dias)</Text>
            <TextInput
              className="bg-secondary text-white p-4 rounded-lg font-roboto"
              placeholder="30"
              placeholderTextColor="#666"
              value={plan.duration.toString()}
              onChangeText={(text) => {
                const numericValue = parseInt(text) || 0;
                setPlan(prev => ({ ...prev, duration: numericValue }));
              }}
              keyboardType="numeric"
            />
          </View>

  
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-lg font-bold font-roboto">Funcionalidades</Text>
              <TouchableOpacity
                onPress={addFeature}
                className="bg-[#4abdd4] px-3 py-1 rounded-lg"
              >
                <Text className="text-white font-bold font-roboto">+ Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {plan.features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <TextInput
                  className="flex-1 bg-secondary text-white p-3 rounded-lg mr-2 font-roboto"
                  placeholder={`Funcionalidade ${index + 1}`}
                  placeholderTextColor="#666"
                  value={feature}
                  onChangeText={(text) => updateFeature(index, text)}
                />
                {plan.features.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeFeature(index)}
                    className="bg-red-600 p-3 rounded-lg"
                  >
                    <MaterialIcons name="delete" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

  
          <View>
            <TouchableOpacity
              onPress={() => setPlan(prev => ({ ...prev, isActive: !prev.isActive }))}
              className="flex-row items-center"
            >
              <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                plan.isActive ? 'bg-[#4abdd4] border-[#4abdd4]' : 'border-gray-400'
              }`}>
                {plan.isActive && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </View>
              <Text className="text-white text-lg font-roboto">Plano ativo</Text>
            </TouchableOpacity>
          </View>

  
          <TouchableOpacity
            onPress={handleSavePlan}
            disabled={loading}
            className={`bg-[#4abdd4] p-4 rounded-lg items-center mt-6 ${
              loading ? 'opacity-50' : ''
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold font-roboto">Criar Plano</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}