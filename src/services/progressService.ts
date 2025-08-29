import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProgressData {
  weightLoss: {
    current: number;
    change: number;
  };
  caloriesBurned: {
    total: number;
    change: number;
  };
  thisWeek: {
    workoutsCompleted: number;
    totalWorkouts: number;
    progress: number;
  };
  performanceMetrics: {
    cardioEndurance: {
      value: number;
      change: number;
    };
    strengthTraining: {
      value: number;
      change: number;
    };
    flexibility: {
      value: number;
      change: number;
    };
  };
  recentAchievements: Array<{
    title: string;
    description: string;
    achievedAt: string;
    icon: string;
  }>;
  monthlyGoals: {
    weightLoss: {
      target: number;
      current: number;
      progress: number;
    };
    workouts: {
      target: number;
      current: number;
      progress: number;
    };
  };
}


const transformBackendData = (backendData: any): ProgressData => {
  return {
    weightLoss: {
      current: backendData.weightLoss?.current || 0,
      change: backendData.weightLoss?.percentage || 0
    },
    caloriesBurned: {
      total: backendData.caloriesBurned?.total || 0,
      change: backendData.caloriesBurned?.percentage || 0
    },
    thisWeek: {
      workoutsCompleted: backendData.thisWeek?.workoutsCompleted || 0,
      totalWorkouts: backendData.thisWeek?.totalWorkouts || 5,
      progress: Math.round(((backendData.thisWeek?.workoutsCompleted || 0) / (backendData.thisWeek?.totalWorkouts || 5)) * 100)
    },
    performanceMetrics: {
      cardioEndurance: {
        value: backendData.performanceMetrics?.cardioEndurance?.value || 0,
        change: backendData.performanceMetrics?.cardioEndurance?.trend === 'up' ? 12 : backendData.performanceMetrics?.cardioEndurance?.trend === 'down' ? -8 : 0
      },
      strengthTraining: {
        value: backendData.performanceMetrics?.strengthTraining?.value || 0,
        change: backendData.performanceMetrics?.strengthTraining?.trend === 'up' ? 8 : backendData.performanceMetrics?.strengthTraining?.trend === 'down' ? -5 : 0
      },
      flexibility: {
        value: backendData.performanceMetrics?.flexibility?.value || 0,
        change: backendData.performanceMetrics?.flexibility?.trend === 'up' ? 5 : backendData.performanceMetrics?.flexibility?.trend === 'down' ? -3 : 0
      }
    },
    recentAchievements: (backendData.recentAchievements || []).map((achievement: any) => ({
      title: achievement.title,
      description: achievement.description,
      achievedAt: achievement.date,
      icon: achievement.icon
    })),
    monthlyGoals: {
      weightLoss: {
        target: backendData.monthlyGoals?.weightLoss?.target || 3,
        current: backendData.monthlyGoals?.weightLoss?.current || 0,
        progress: Math.round(((backendData.monthlyGoals?.weightLoss?.current || 0) / (backendData.monthlyGoals?.weightLoss?.target || 3)) * 100)
      },
      workouts: {
        target: backendData.monthlyGoals?.workouts?.target || 20,
        current: backendData.monthlyGoals?.workouts?.current || 0,
        progress: Math.round(((backendData.monthlyGoals?.workouts?.current || 0) / (backendData.monthlyGoals?.workouts?.target || 20)) * 100)
      }
    }
  };
};

export const progressService = {
  
  getProgress: async (): Promise<ProgressData> => {
    try {
      const response = await api.get('/progress/me');
      const backendData = response.data.data;
      return transformBackendData(backendData);
    } catch (error) {
      console.error('Erro ao buscar dados de progresso:', error);
      throw error;
    }
  },

  
  updateWeightLoss: async (currentWeight: number): Promise<void> => {
    try {
      await api.put('/progress/weight-loss', { currentWeight });
    } catch (error) {
      console.error('Erro ao atualizar perda de peso:', error);
      throw error;
    }
  },

  
  updateCaloriesBurned: async (calories: number): Promise<void> => {
    try {
      await api.put('/progress/calories-burned', { calories });
    } catch (error) {
      console.error('Erro ao atualizar calorias queimadas:', error);
      throw error;
    }
  },

  
  completeWorkout: async (workoutData: { exercisesCompleted: number, totalExercises: number, caloriesBurned: number }): Promise<void> => {
    try {
      await api.post('/progress/complete-workout', workoutData);
    } catch (error) {
      console.error('Erro ao completar treino:', error);
      throw error;
    }
  },

  
  updatePerformanceMetrics: async (metrics: { cardio?: number, strength?: number, flexibility?: number }): Promise<void> => {
    try {
      await api.put('/progress/performance-metrics', metrics);
    } catch (error) {
      console.error('Erro ao atualizar métricas de performance:', error);
      throw error;
    }
  },

  
  addAchievement: async (achievement: { title: string, description: string, icon: string }): Promise<void> => {
    try {
      await api.post('/progress/achievements', achievement);
    } catch (error) {
      console.error('Erro ao adicionar conquista:', error);
      throw error;
    }
  },

  
  updateMonthlyGoals: async (goals: { weightLossTarget?: number, workoutsTarget?: number }): Promise<void> => {
    try {
      await api.put('/progress/monthly-goals', goals);
    } catch (error) {
      console.error('Erro ao atualizar metas mensais:', error);
      throw error;
    }
  },

  
  resetWeeklyProgress: async (): Promise<void> => {
    try {
      await api.post('/progress/reset-weekly');
    } catch (error) {
      console.error('Erro ao resetar progresso semanal:', error);
      throw error;
    }
  },

  
  getCurrentUser: async () => {
    try {
      const userString = await AsyncStorage.getItem('@GymApp:user');
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }
};

export default progressService;