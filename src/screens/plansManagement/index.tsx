import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { styles } from './styles';
import { formatStripePrice } from '../../utils/priceUtils';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PlansManagement() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    if (!user || user.role !== 'admin') {
      Alert.alert(
        'Acesso Negado',
        'Apenas administradores podem acessar esta tela.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }
    fetchPlans();
  }, [user, navigation]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payment/plans');
      setPlans(response.data.plans || []);
    } catch (error: any) {
      console.error('Erro ao buscar planos:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os planos. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlans();
    setRefreshing(false);
  };

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/payment/plans/${planId}`, {
        isActive: !currentStatus
      });

      setPlans(prevPlans =>
        prevPlans.map(plan =>
          plan.id === planId
            ? { ...plan, isActive: !currentStatus }
            : plan
        )
      );

      Alert.alert(
        'Sucesso',
        `Plano ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`
      );
    } catch (error: any) {
      console.error('Erro ao alterar status do plano:', error);
      Alert.alert(
        'Erro',
        'Não foi possível alterar o status do plano. Tente novamente.'
      );
    }
  };

  const deletePlan = async (planId: string, planName: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o plano "${planName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/payment/plans/${planId}`);
              setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
              Alert.alert('Sucesso', 'Plano excluído com sucesso!');
            } catch (error: any) {
              console.error('Erro ao excluir plano:', error);
              Alert.alert(
                'Erro',
                'Não foi possível excluir o plano. Tente novamente.'
              );
            }
          }
        }
      ]
    );
  };

  const navigateToCreatePlan = () => {
    navigation.navigate('PlanCreation' as never);
  };



  const formatDuration = (duration: number) => {
    if (duration === 30) return '1 mês';
    if (duration === 90) return '3 meses';
    if (duration === 180) return '6 meses';
    if (duration === 365) return '1 ano';
    return `${duration} dias`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando planos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Planos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToCreatePlan}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Novo Plano</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum plano encontrado</Text>
            <Text style={styles.emptySubtext}>
              Crie seu primeiro plano tocando no botão "Novo Plano"
            </Text>
          </View>
        ) : (
          plans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planBadge}>
                    <Text style={[
                      styles.planStatus,
                      { color: plan.isActive ? '#4CAF50' : '#FF5722' }
                    ]}>
                      {plan.isActive ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
                <View style={styles.planActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: plan.isActive ? '#FF5722' : '#4CAF50' }
                    ]}
                    onPress={() => togglePlanStatus(plan.id, plan.isActive)}
                  >
                    <Ionicons
                      name={plan.isActive ? 'pause' : 'play'}
                      size={16}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
                    onPress={() => deletePlan(plan.id, plan.name)}
                  >
                    <Ionicons name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.planDescription}>{plan.description}</Text>

              <View style={styles.planDetails}>
                <View style={styles.planDetailItem}>
                  <Ionicons name="cash-outline" size={16} color="#666" />
                  <Text style={styles.planDetailText}>{formatStripePrice(plan.price)}</Text>
                </View>
                <View style={styles.planDetailItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.planDetailText}>{formatDuration(plan.duration)}</Text>
                </View>
              </View>

              {plan.features && plan.features.length > 0 && (
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Características:</Text>
                  {plan.features.map((feature, index) => (
                    <View key={`${plan.id}-feature-${index}`} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}