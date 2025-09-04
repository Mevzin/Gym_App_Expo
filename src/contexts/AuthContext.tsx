import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'personal';
  age?: number;
  weight?: number;
  height?: number;
  fileId?: string;
  interval?: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@GymApp:token');
      const userData = await AsyncStorage.getItem('@GymApp:user');
      
      if (storedToken && userData) {
        const parsedUser = JSON.parse(userData);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login com:', email);
      setIsLoading(true);
      
      console.log('📡 Chamando authService.login...');
      const response = await authService.login(email, password);
      console.log('✅ Resposta do login:', response);
      
      if (response.token && response.user) {
        console.log('💾 Salvando dados no AsyncStorage...');
        // Salvar no AsyncStorage
        await AsyncStorage.setItem('@GymApp:token', response.token);
        await AsyncStorage.setItem('@GymApp:user', JSON.stringify(response.user));
        
        console.log('🔄 Atualizando estado...');
        // Atualizar estado
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        console.log('✅ Login realizado com sucesso!');
      } else {
        console.error('❌ Resposta inválida do servidor:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Erro durante o login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
      // Remover do AsyncStorage
      await AsyncStorage.removeItem('@GymApp:token');
      await AsyncStorage.removeItem('@GymApp:user');
      
      // Atualizar estado
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@GymApp:user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};