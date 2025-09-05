import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from '../ui/card';
import Button from '../ui/button';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatStripePrice } from '../../utils/priceUtils';

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
  trialPeriodDays?: number;
  isActive: boolean;
}

interface PlanSelectorProps {
  onPlanSelect: (plan: Plan) => void;
  selectedPlanId?: string;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  onPlanSelect,
  selectedPlanId,
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('@GymApp:token');
      const response = await api.get('/payment/plans', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const activePlans = response.data.plans.filter((plan: Plan) => plan.isActive);
      setPlans(activePlans);

  
      if (selectedPlanId) {
        const preSelectedPlan = activePlans.find((plan: Plan) => plan._id === selectedPlanId);
        if (preSelectedPlan) {
          setSelectedPlan(preSelectedPlan);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoading(false);
    }
  };



  const calculateYearlySavings = (monthlyPlan: Plan, yearlyPlan: Plan) => {
    const monthlyYearlyTotal = monthlyPlan.price * 12;
    const savings = monthlyYearlyTotal - yearlyPlan.price;
    return savings;
  };

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
    onPlanSelect(plan);
  };

  const getPopularPlan = () => {
    
    return plans?.find(plan => plan.interval === 'month');
  };

  const getBestValuePlan = () => {
    
    return plans?.find(plan => plan.interval === 'year');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Carregando planos...</Text>
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg text-gray-600 text-center">
          Nenhum plano disponível no momento.
        </Text>
      </View>
    );
  }

  const popularPlan = getPopularPlan();
  const bestValuePlan = getBestValuePlan();
  const monthlyPlan = plans?.find(plan => plan.interval === 'month');
    const yearlyPlan = plans?.find(plan => plan.interval === 'year');

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold text-center mb-2">Escolha seu Plano</Text>
      <Text className="text-gray-600 text-center mb-6">
        Desbloqueie todo o potencial do seu treino
      </Text>

      {monthlyPlan && yearlyPlan && (
        <View className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <Text className="text-center text-green-800 font-semibold">
            💰 Economize {formatStripePrice(calculateYearlySavings(monthlyPlan, yearlyPlan), yearlyPlan.currency)}
            escolhendo o plano anual!
          </Text>
        </View>
      )}

      <View className="space-y-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan?._id === plan._id;
          const isPopular = plan._id === popularPlan?._id;
          const isBestValue = plan._id === bestValuePlan?._id;

          return (
            <TouchableOpacity
              key={plan._id}
              onPress={() => handlePlanSelection(plan)}
              className={`relative ${isSelected
                  ? 'border-2 border-blue-500'
                  : 'border border-gray-200'
                }`}
            >
              {isPopular && (
                <View className="absolute -top-3 left-4 bg-orange-500 px-3 py-1 rounded-full z-10">
                  <Text className="text-white text-xs font-bold">MAIS POPULAR</Text>
                </View>
              )}

              {isBestValue && (
                <View className="absolute -top-3 right-4 bg-green-500 px-3 py-1 rounded-full z-10">
                  <Text className="text-white text-xs font-bold">MELHOR VALOR</Text>
                </View>
              )}

              <Card className={`p-6 ${isSelected ? 'bg-blue-50' : 'bg-white'
                }`}>
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text className="text-xl font-bold mb-1">{plan.name}</Text>
                    <Text className="text-gray-600 mb-3">{plan.description}</Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-2xl font-bold text-blue-600">
                      {formatStripePrice(plan.price, plan.currency)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      /{plan.interval === 'month' ? 'mês' : 'ano'}
                    </Text>

                    {plan.interval === 'year' && monthlyPlan && (
                      <Text className="text-xs text-green-600 font-medium mt-1">
                        {formatStripePrice(plan.price / 12, plan.currency)}/mês
                      </Text>
                    )}
                  </View>
                </View>

                {plan.trialPeriodDays && (
                  <View className="mb-4 p-3 bg-green-100 rounded-lg">
                    <Text className="text-green-800 font-medium text-center">
                      🎉 {plan.trialPeriodDays} dias grátis para testar!
                    </Text>
                  </View>
                )}

                {plan.features && plan.features.length > 0 && (
                  <View className="mb-4">
                    <Text className="font-semibold mb-2 text-gray-800">Recursos inclusos:</Text>
                    {plan.features.map((feature, index) => (
                      <View key={index} className="flex-row items-center mb-1">
                        <Text className="text-green-600 mr-2">✓</Text>
                        <Text className="text-gray-700 flex-1">{feature}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {isSelected && (
                  <View className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <Text className="text-blue-800 font-medium text-center">
                      ✓ Plano Selecionado
                    </Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mt-8 p-4 bg-gray-50 rounded-lg">
        <Text className="text-sm text-gray-600 text-center mb-2">
          ✓ Cancele a qualquer momento
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-2">
          ✓ Suporte 24/7
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          ✓ Pagamento seguro com Stripe
        </Text>
      </View>
    </ScrollView>
  );
};

export default PlanSelector;