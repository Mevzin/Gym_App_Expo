import { STRIPE_PUBLISHABLE_KEY } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PlanSelector from '../../components/PlanSelector';
import PaymentComponent from '../../components/Payment';
import SubscriptionManager from '../../components/SubscriptionManager';
import Button from '../../components/ui/button';
import api from '../../services/api';

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

type SubscriptionStep = 'view' | 'plans' | 'payment';

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>('view');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('@GymApp:token');
      const response = await api.get('/payment/subscription', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHasSubscription(!!response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setHasSubscription(false);
      } else {
        console.error('Erro ao verificar assinatura:', error);
        setHasSubscription(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = () => {
    Alert.alert(
      'Sucesso!',
      'Sua assinatura foi criada com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => {
            setCurrentStep('view');
            setHasSubscription(true);
            checkSubscriptionStatus();
          },
        },
      ]
    );
  };

  const handlePaymentError = (error: string) => {
    Alert.alert('Erro no Pagamento', error);
  };

  const handleSubscriptionChange = () => {
    checkSubscriptionStatus();
    if (!hasSubscription) {
      setCurrentStep('plans');
    }
  };

  const renderStepIndicator = () => {
    if (hasSubscription || currentStep === 'view') return null;

    return (
      <View className="flex-row justify-center items-center mb-6 px-4">
        <View className="flex-row items-center">
          <View className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'plans' ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
            <Text className={`text-sm font-bold ${currentStep === 'plans' ? 'text-white' : 'text-gray-600'
              }`}>1</Text>
          </View>
          <Text className={`ml-2 text-sm ${currentStep === 'plans' ? 'text-blue-600 font-semibold' : 'text-gray-600'
            }`}>Escolher Plano</Text>
        </View>

        <View className="w-8 h-0.5 bg-gray-300 mx-4" />

        <View className="flex-row items-center">
          <View className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
            <Text className={`text-sm font-bold ${currentStep === 'payment' ? 'text-white' : 'text-gray-600'
              }`}>2</Text>
          </View>
          <Text className={`ml-2 text-sm ${currentStep === 'payment' ? 'text-blue-600 font-semibold' : 'text-gray-600'
            }`}>Pagamento</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Carregando...</Text>
        </View>
      );
    }

    switch (currentStep) {
      case 'view':
        return (
          <SubscriptionManager
            onSubscriptionChange={handleSubscriptionChange}
          />
        );

      case 'plans':
        return (
          <View className="flex-1">
            <PlanSelector
              onPlanSelect={handlePlanSelect}
              selectedPlanId={selectedPlan?._id}
            />

            {selectedPlan && (
              <View className="p-4 border-t border-gray-200">
                <Button
                  onPress={() => setCurrentStep('payment')}
                  className="w-full"
                >
                  <Text className="text-white font-semibold">
                    Continuar para Pagamento
                  </Text>
                </Button>

                <Button
                  onPress={() => {
                    setCurrentStep('view');
                    setSelectedPlan(null);
                  }}
                  className="w-full mt-3 bg-gray-600"
                >
                  <Text className="text-white font-semibold">Voltar</Text>
                </Button>
              </View>
            )}
          </View>
        );

      case 'payment':
        return (
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <View className="flex-1">
              <ScrollView className="flex-1">
                <PaymentComponent
                  selectedPlan={selectedPlan!}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </ScrollView>

              <View className="p-4 border-t border-gray-200">
                <Button
                  onPress={() => setCurrentStep('plans')}
                  className="w-full bg-gray-600"
                >
                  <Text className="text-white font-semibold">Voltar aos Planos</Text>
                </Button>
              </View>
            </View>
          </StripeProvider>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <Button
          onPress={() => {
            if (currentStep === 'payment') {
              setCurrentStep('plans');
            } else if (currentStep === 'plans') {
              setCurrentStep('view');
              setSelectedPlan(null);
            } else {
              navigation.goBack();
            }
          }}
          className="bg-transparent p-0"
        >
          <Text className="text-blue-600 text-lg">← Voltar</Text>
        </Button>

        <Text className="text-lg font-semibold">
          {currentStep === 'view' ? 'Assinatura' :
            currentStep === 'plans' ? 'Escolher Plano' : 'Pagamento'}
        </Text>

        <View className="w-16" />
      </View>

      {renderStepIndicator()}
      {renderContent()}
    </SafeAreaView>
  );
}