import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDayOfWeek } from '../utils/dateUtils';
import { logger } from '../utils/logger';

const getCompletedExercisesKey = (userId: string) => `completed_exercises_${userId}`;

interface CompletedExercise {
  exerciseName: string;
  day: string;
  completedAt: string;
}

export class CompletedExercisesStorage {
  static async getCompletedExercises(userId: string): Promise<CompletedExercise[]> {
    try {
      const key = getCompletedExercisesKey(userId);
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error('Erro ao buscar exercícios finalizados:', error);
      return [];
    }
  }

  static async markExerciseAsCompleted(userId: string, exerciseName: string, day: string): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises(userId);
      const today = new Date().toISOString().split('T')[0];
      
      const existingIndex = completedExercises.findIndex(
        exercise => exercise.exerciseName === exerciseName && exercise.day === day
      );

      if (existingIndex === -1) {
        completedExercises.push({
          exerciseName,
          day,
          completedAt: today
        });
      }

      const key = getCompletedExercisesKey(userId);
      await AsyncStorage.setItem(key, JSON.stringify(completedExercises));
    } catch (error) {
      logger.error('Erro ao marcar exercício como finalizado:', error);
    }
  }

  static async unmarkExerciseAsCompleted(userId: string, exerciseName: string, day: string): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises(userId);
      
      const filteredExercises = completedExercises.filter(
        exercise => !(exercise.exerciseName === exerciseName && exercise.day === day)
      );

      const key = getCompletedExercisesKey(userId);
      await AsyncStorage.setItem(key, JSON.stringify(filteredExercises));
    } catch (error) {
      logger.error('Erro ao desmarcar exercício como finalizado:', error);
    }
  }

  static async isExerciseCompleted(userId: string, exerciseName: string, day: string): Promise<boolean> {
    try {
      const completedExercises = await this.getCompletedExercises(userId);
      const today = new Date().toISOString().split('T')[0];
      
      return completedExercises.some(
        exercise => 
          exercise.exerciseName === exerciseName && 
          exercise.day === day &&
          exercise.completedAt === today
      );
    } catch (error) {
      logger.error('Erro ao verificar se exercício está finalizado:', error);
      return false;
    }
  }

  static async cleanOldCompletedExercises(userId: string): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises(userId);
      const today = new Date().toISOString().split('T')[0];
      const currentDay = getDayOfWeek();
      
      const validExercises = completedExercises.filter(exercise => {
        const isToday = exercise.completedAt === today;
        const isCurrentDay = exercise.day === currentDay;
        return isToday && isCurrentDay;
      });

      const key = getCompletedExercisesKey(userId);
      await AsyncStorage.setItem(key, JSON.stringify(validExercises));
    } catch (error) {
      logger.error('Erro ao limpar exercícios antigos:', error);
    }
  }

  static async getCompletedExercisesForDay(userId: string, day: string): Promise<string[]> {
    try {
      const completedExercises = await this.getCompletedExercises(userId);
      const today = new Date().toISOString().split('T')[0];
      
      return completedExercises
        .filter(exercise => 
          exercise.day === day && 
          exercise.completedAt === today
        )
        .map(exercise => exercise.exerciseName);
    } catch (error) {
      logger.error('Erro ao buscar exercícios finalizados do dia:', error);
      return [];
    }
  }
}