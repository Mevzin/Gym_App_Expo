import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Card } from '../ui/card';
import Button from '../ui/button';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatStripePrice } from '../../utils/priceUtils';

interface MonthlyPayment {
  _id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  planName: string;
  planPrice: number;
  currency: string;
  interval: 'month' | 'year';
  createdAt: Date;
  updatedAt: Date;
}

interface MonthlyPaymentManagerProps {
  onMonthlyPaymentChange?: () => void;
}

export const MonthlyPaymentManager: React.FC<MonthlyPaymentManagerProps> = ({
  onMonthlyPaymentChange,
}) => {
  const [monthlyPayment, setMonthlyPayment] = useState<MonthlyPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchMonthlyPayment();
  }, []);

  const fetchMonthlyPayment = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('@GymApp:token');
      const response = await api.get('/payment/monthly-payment', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setMonthlyPayment(response.data);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Erro ao buscar mensalidade:', error);
      }
      
    } finally {
      setLoading(false);
    }
  };

  const cancelMonthlyPayment = async () => {
    if (!monthlyPayment) return;

    Alert.alert(
      'Cancelar Mensalidade',
      'Tem certeza que deseja cancelar sua mensalidade? Você ainda terá acesso aos recursos premium até o final do período atual.',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setCanceling(true);
              const token = await AsyncStorage.getItem('@GymApp:token');

              await api.post('/payment/cancel-subscription', {}, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert(
                'Mensalidade Cancelada',
                'Sua mensalidade foi cancelada com sucesso. Você ainda terá acesso aos recursos premium até o final do período atual.'
              );

        
              await fetchMonthlyPayment();
              onMonthlyPaymentChange?.();
            } catch (error: any) {
              console.error('Erro ao cancelar mensalidade:', error);
              Alert.alert(
                'Erro',
                error.response?.data?.message || 'Erro ao cancelar mensalidade'
              );
            } finally {
              setCanceling(false);
            }
          },
        },
      ]
    );
  };

  const formatPriceWithCurrency = (price: number, currency: string) => {
    return formatStripePrice(price, currency.toUpperCase());
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'trialing':
        return 'text-blue-600';
      case 'canceled':
        return 'text-red-600';
      case 'past_due':
      case 'unpaid':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'trialing':
        return 'Período de Teste';
      case 'canceled':
        return 'Cancelada';
      case 'past_due':
        return 'Pagamento Atrasado';
      case 'unpaid':
        return 'Não Paga';
      default:
        return status;
    }
  };

  const isMonthlyPaymentActive = () => {
    return monthlyPayment && ['active', 'trialing'].includes(monthlyPayment.status);
  };

  const canCancelMonthlyPayment = () => {
    return monthlyPayment && monthlyPayment.status !== 'canceled';
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Carregando mensalidade...</Text>
      </View>
    );
  }

  if (!monthlyPayment) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Você não possui uma mensalidade ativa
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Assine um plano premium para ter acesso a recursos exclusivos
        </Text>
        <View className="w-full max-w-sm">
          <Button
            onPress={() => onMonthlyPaymentChange?.()}
            className="w-full"
          >
            <Text className="text-white font-semibold">Ver Planos Disponíveis</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold text-center mb-6">Minha Mensalidade</Text>

      <Card className="p-6 mb-6">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-xl font-bold mb-2">{monthlyPayment.planName}</Text>
            <Text className={`text-lg font-semibold ${getStatusColor(monthlyPayment.status)}`}>
              {getStatusText(monthlyPayment.status)}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-2xl font-bold text-blue-600">
              {formatPriceWithCurrency(monthlyPayment.planPrice, monthlyPayment.currency)}
            </Text>
            <Text className="text-sm text-gray-500">
              /{monthlyPayment.interval === 'month' ? 'mês' : 'ano'}
            </Text>
          </View>
        </View>

        <View className="border-t border-gray-200 pt-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Início do período:</Text>
            <Text className="font-medium">
              {formatDate(monthlyPayment.currentPeriodStart)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Fim do período:</Text>
            <Text className="font-medium">
              {formatDate(monthlyPayment.currentPeriodEnd)}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Mensalidade desde:</Text>
            <Text className="font-medium">
              {formatDate(monthlyPayment.createdAt)}
            </Text>
          </View>
        </View>
      </Card>

      {isMonthlyPaymentActive() && (
        <Card className="p-4 mb-6 bg-green-50 border-green-200">
          <Text className="text-green-800 font-semibold text-center mb-2">
            ✓ Mensalidade Ativa
          </Text>
          <Text className="text-green-700 text-center text-sm">
            Você tem acesso a todos os recursos premium até {formatDate(monthlyPayment.currentPeriodEnd)}
          </Text>
        </Card>
      )}

      {monthlyPayment.status === 'canceled' && (
        <Card className="p-4 mb-6 bg-orange-50 border-orange-200">
          <Text className="text-orange-800 font-semibold text-center mb-2">
            ⚠️ Mensalidade Cancelada
          </Text>
          <Text className="text-orange-700 text-center text-sm">
            Sua mensalidade foi cancelada, mas você ainda tem acesso aos recursos premium até {formatDate(monthlyPayment.currentPeriodEnd)}
          </Text>
        </Card>
      )}

      {monthlyPayment.status === 'past_due' && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <Text className="text-red-800 font-semibold text-center mb-2">
            ❌ Pagamento Atrasado
          </Text>
          <Text className="text-red-700 text-center text-sm">
            Há um problema com o pagamento da sua mensalidade. Por favor, atualize seu método de pagamento.
          </Text>
        </Card>
      )}

      <View className="space-y-3">
        {canCancelMonthlyPayment() && (
          <Button
            onPress={cancelMonthlyPayment}
            disabled={canceling}
            className="w-full bg-red-600"
          >
            {canceling ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" className="mr-2" />
                <Text className="text-white font-semibold">Cancelando...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold">Cancelar Mensalidade</Text>
            )}
          </Button>
        )}

        <Button
          onPress={fetchMonthlyPayment}
          className="w-full bg-gray-600"
        >
          <Text className="text-white font-semibold">Atualizar Informações</Text>
        </Button>
      </View>

      <View className="mt-8 p-4 bg-gray-50 rounded-lg">
        <Text className="text-sm text-gray-600 text-center mb-2">
          💳 Pagamentos processados com segurança pelo Stripe
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          📞 Precisa de ajuda? Entre em contato com nosso suporte
        </Text>
      </View>
    </ScrollView>
  );
};

export default MonthlyPaymentManager;