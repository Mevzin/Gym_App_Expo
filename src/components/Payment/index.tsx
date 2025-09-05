import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useStripe, CardField, CardFieldInput } from '@stripe/stripe-react-native';
import Button from '../ui/button';
import { Card } from '../ui/card';
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
}

interface PaymentComponentProps {
  selectedPlan?: Plan;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

export const PaymentComponent: React.FC<PaymentComponentProps> = ({
  selectedPlan,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { confirmPayment, createPaymentMethod } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(selectedPlan?._id || null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = await AsyncStorage.getItem('@GymApp:token');
      const response = await api.get('/payment/plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      setPlans([]);
    }
  };

  const createSubscription = async () => {
    if (!selectedPlanId) {
      Alert.alert('Erro', 'Selecione um plano para continuar');
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert('Erro', 'Por favor, preencha os dados do cartão corretamente');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('@GymApp:token');

  
      const userData = await AsyncStorage.getItem('@GymApp:user');
      const user = userData ? JSON.parse(userData) : null;
      const userId = user?.id || user?._id;
      
      if (!userId) {
        throw new Error('Usuário não encontrado');
      }
      
      await api.post('/payment/customer', { userId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

  
      const { error: paymentMethodError, paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
      });

      if (paymentMethodError || !paymentMethod) {
        throw new Error(paymentMethodError?.message || 'Erro ao criar método de pagamento');
      }

  
      const subscriptionResponse = await api.post('/payment/subscription', {
        planId: selectedPlanId,
        paymentMethodId: paymentMethod.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { clientSecret } = subscriptionResponse.data;

  
      if (!clientSecret) {
        throw new Error('Client secret não recebido do servidor');
      }

      console.log('Client secret recebido:', clientSecret ? 'exists' : 'null');

  
      const { error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        console.error('Erro no pagamento:', error);
        onPaymentError?.(error.message || 'Erro no pagamento');
        Alert.alert('Erro no Pagamento', error.message || 'Ocorreu um erro durante o pagamento');
      } else {
        Alert.alert('Sucesso!', 'Assinatura criada com sucesso!');
        onPaymentSuccess?.();
      }
    } catch (error: any) {
      console.error('Erro ao criar assinatura:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao processar pagamento';
      onPaymentError?.(errorMessage);
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };



  const currentPlan = plans?.find(plan => plan._id === selectedPlanId) || selectedPlan;

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-center mb-6">Assinatura Premium</Text>

      {currentPlan && (
        <Card className="mb-6 p-4">
          <Text className="text-xl font-semibold mb-2">{currentPlan.name}</Text>
          <Text className="text-gray-600 mb-3">{currentPlan.description}</Text>
          <Text className="text-2xl font-bold text-blue-600 mb-3">
            {formatStripePrice(currentPlan.price, currentPlan.currency)}
            <Text className="text-sm text-gray-500">/{currentPlan.interval === 'month' ? 'mês' : 'ano'}</Text>
          </Text>

          {currentPlan.features && currentPlan.features.length > 0 && (
            <View className="mb-3">
              <Text className="font-semibold mb-2">Recursos inclusos:</Text>
              {currentPlan.features.map((feature, index) => (
                <Text key={index} className="text-gray-600 mb-1">• {feature}</Text>
              ))}
            </View>
          )}

          {currentPlan.trialPeriodDays && (
            <Text className="text-green-600 font-medium">
              🎉 {currentPlan.trialPeriodDays} dias grátis!
            </Text>
          )}
        </Card>
      )}

      <Card className="mb-6 p-4">
        <Text className="text-lg font-semibold mb-4">Dados do Cartão</Text>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
            expiration: 'MM/AA',
            cvc: 'CVC',
            postalCode: 'CEP',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            fontSize: 16,
            placeholderColor: '#999999',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 10,
          }}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />
      </Card>

      <Button
        onPress={createSubscription}
        disabled={loading || !cardDetails?.complete}
        className="w-full"
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="white" className="mr-2" />
            <Text className="text-white font-semibold">Processando...</Text>
          </View>
        ) : (
          <Text className="text-white font-semibold">
            {currentPlan?.trialPeriodDays ? 'Iniciar Período Gratuito' : 'Assinar Agora'}
          </Text>
        )}
      </Button>

      <Text className="text-xs text-gray-500 text-center mt-4">
        Seus dados estão seguros e protegidos pelo Stripe
      </Text>
    </View>
  );
};

export default PaymentComponent;