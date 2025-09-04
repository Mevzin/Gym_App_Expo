import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  stripeProductId: string;
  features: string[];
  isActive: boolean;
  trialPeriodDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
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

export interface Payment {
  _id: string;
  userId: string;
  subscriptionId?: string;
  stripePaymentIntentId: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled';
  paymentMethod: string;
  description?: string;
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class PaymentService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('@GymApp:token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Planos
  async getPlans(): Promise<Plan[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get('/payment/plans', { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      throw error;
    }
  }

  async getPlanById(planId: string): Promise<Plan> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get(`/payment/plans/${planId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      throw error;
    }
  }

  // Cliente Stripe
  async createCustomer(): Promise<{ customerId: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post('/payment/create-customer', {}, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  // Assinaturas
  async createSubscription(planId: string): Promise<{
    subscriptionId: string;
    clientSecret: string;
    status: string;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post('/payment/create-subscription',
        { planId },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  async getSubscription(): Promise<Subscription | null> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get('/payment/subscription', { headers });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Usuário não tem assinatura
      }
      console.error('Erro ao buscar assinatura:', error);
      throw error;
    }
  }

  async cancelSubscription(): Promise<{ message: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post('/payment/cancel-subscription', {}, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }

  // Métodos de pagamento
  async createSetupIntent(): Promise<{ clientSecret: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post('/payment/setup-intent', {}, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar setup intent:', error);
      throw error;
    }
  }

  // Histórico de pagamentos
  async getPaymentHistory(): Promise<Payment[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get('/payment/history', { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico de pagamentos:', error);
      throw error;
    }
  }

  // Faturas
  async getInvoices(): Promise<any[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get('/payment/invoices', { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar faturas:', error);
      throw error;
    }
  }

  // Utilitários
  formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Ativa',
      trialing: 'Período de Teste',
      canceled: 'Cancelada',
      past_due: 'Pagamento Atrasado',
      unpaid: 'Não Paga',
      succeeded: 'Pago',
      pending: 'Pendente',
      failed: 'Falhou',
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      active: 'text-green-600',
      trialing: 'text-blue-600',
      canceled: 'text-red-600',
      past_due: 'text-orange-600',
      unpaid: 'text-orange-600',
      succeeded: 'text-green-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600',
    };
    return colorMap[status] || 'text-gray-600';
  }

  isSubscriptionActive(subscription: Subscription | null): boolean {
    return subscription ? ['active', 'trialing'].includes(subscription.status) : false;
  }

  canCancelSubscription(subscription: Subscription | null): boolean {
    return subscription ? subscription.status !== 'canceled' : false;
  }

  calculateYearlySavings(monthlyPlan: Plan, yearlyPlan: Plan): number {
    const monthlyYearlyTotal = monthlyPlan.price * 12;
    return monthlyYearlyTotal - yearlyPlan.price;
  }

  getDaysUntilPeriodEnd(subscription: Subscription): number {
    const now = new Date();
    const periodEnd = new Date(subscription.currentPeriodEnd);
    const diffTime = periodEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}

export const paymentService = new PaymentService();
export default paymentService;