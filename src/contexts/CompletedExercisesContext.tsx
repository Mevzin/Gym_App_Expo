import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CompletedExercisesStorage } from '../services/completedExercisesStorage';
import { getDayOfWeek } from '../utils/dateUtils';
import { useAuth } from './AuthContext';

interface CompletedExercisesContextType {
  completedExercises: string[];
  refreshCompletedExercises: () => Promise<void>;
  markExerciseAsCompleted: (exerciseName: string) => Promise<void>;
  unmarkExerciseAsCompleted: (exerciseName: string) => Promise<void>;
  isExerciseCompleted: (exerciseName: string) => boolean;
}

const CompletedExercisesContext = createContext<CompletedExercisesContextType | undefined>(undefined);

interface CompletedExercisesProviderProps {
  children: ReactNode;
}

export function CompletedExercisesProvider({ children }: CompletedExercisesProviderProps) {
  const { user } = useAuth();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const refreshCompletedExercises = useCallback(async () => {
    try {
      if (!user?.id) return;
      const dayOfWeek = getDayOfWeek();
      const completed = await CompletedExercisesStorage.getCompletedExercisesForDay(user.id, dayOfWeek);
      setCompletedExercises(completed);
    } catch (error) {
      console.error('Erro ao atualizar exercícios finalizados:', error);
    }
  }, [user?.id]);

  const markExerciseAsCompleted = useCallback(async (exerciseName: string) => {
    try {
      if (!user?.id) return;
      const dayOfWeek = getDayOfWeek();
      await CompletedExercisesStorage.markExerciseAsCompleted(user.id, exerciseName, dayOfWeek);
      await refreshCompletedExercises();
    } catch (error) {
      console.error('Erro ao marcar exercício como finalizado:', error);
    }
  }, [user?.id, refreshCompletedExercises]);

  const unmarkExerciseAsCompleted = useCallback(async (exerciseName: string) => {
    try {
      if (!user?.id) return;
      const dayOfWeek = getDayOfWeek();
      await CompletedExercisesStorage.unmarkExerciseAsCompleted(user.id, exerciseName, dayOfWeek);
      await refreshCompletedExercises();
    } catch (error) {
      console.error('Erro ao desmarcar exercício:', error);
    }
  }, [user?.id, refreshCompletedExercises]);

  const isExerciseCompleted = useCallback((exerciseName: string) => {
    return completedExercises.includes(exerciseName);
  }, [completedExercises]);

  return (
    <CompletedExercisesContext.Provider
      value={{
        completedExercises,
        refreshCompletedExercises,
        markExerciseAsCompleted,
        unmarkExerciseAsCompleted,
        isExerciseCompleted,
      }}
    >
      {children}
    </CompletedExercisesContext.Provider>
  );
}

export function useCompletedExercises() {
  const context = useContext(CompletedExercisesContext);
  if (context === undefined) {
    throw new Error('useCompletedExercises must be used within a CompletedExercisesProvider');
  }
  return context;
}