import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDayOfWeek } from '../utils/dateUtils';
import { logger } from '../utils/logger';

const COMPLETED_EXERCISES_KEY = 'completed_exercises';

interface CompletedExercise {
  exerciseName: string;
  day: string;
  completedAt: string;
}

export class CompletedExercisesStorage {
  static async getCompletedExercises(): Promise<CompletedExercise[]> {
    try {
      const data = await AsyncStorage.getItem(COMPLETED_EXERCISES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error('Erro ao buscar exercícios finalizados:', error);
      return [];
    }
  }

  static async markExerciseAsCompleted(exerciseName: string, day: string): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises();
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

      await AsyncStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(completedExercises));
    } catch (error) {
      logger.error('Erro ao marcar exercício como finalizado:', error);
    }
  }

  static async unmarkExerciseAsCompleted(exerciseName: string, day: string): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises();
      
      const filteredExercises = completedExercises.filter(
        exercise => !(exercise.exerciseName === exerciseName && exercise.day === day)
      );

      await AsyncStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(filteredExercises));
    } catch (error) {
      logger.error('Erro ao desmarcar exercício como finalizado:', error);
    }
  }

  static async isExerciseCompleted(exerciseName: string, day: string): Promise<boolean> {
    try {
      const completedExercises = await this.getCompletedExercises();
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

  static async cleanOldCompletedExercises(): Promise<void> {
    try {
      const completedExercises = await this.getCompletedExercises();
      const today = new Date().toISOString().split('T')[0];
      const currentDay = getDayOfWeek();
      
      const validExercises = completedExercises.filter(exercise => {
        const isToday = exercise.completedAt === today;
        const isCurrentDay = exercise.day === currentDay;
        return isToday && isCurrentDay;
      });

      await AsyncStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(validExercises));
    } catch (error) {
      logger.error('Erro ao limpar exercícios antigos:', error);
    }
  }

  static async getCompletedExercisesForDay(day: string): Promise<string[]> {
    try {
      const completedExercises = await this.getCompletedExercises();
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