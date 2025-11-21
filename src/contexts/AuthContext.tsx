import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  updateUser: (userData: Partial<User>) => Promise<void>;
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
      // Verifica se há dados do usuário salvos localmente
      const userData = await AsyncStorage.getItem('@GymApp:user');
      const tokenData = await AsyncStorage.getItem('@GymApp:token');

      if (userData) {
        const parsedUser = JSON.parse(userData);

        // Verifica se o usuário ainda está autenticado no servidor
        const isAuth = await authService.isAuthenticated();

        if (isAuth) {
          setUser(parsedUser);
          setToken(tokenData);
          setIsAuthenticated(true);
        } else {
          // Se não estiver autenticado, limpa os dados locais
          await AsyncStorage.removeItem('@GymApp:user');
          await AsyncStorage.removeItem('@GymApp:token');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);

      if (response.user) {
        // Os cookies HTTP-only são gerenciados automaticamente pelo navegador/axios
        await AsyncStorage.setItem('@GymApp:user', JSON.stringify(response.user));
        
        // Se houver token na resposta, salva localmente para uso em headers
        if (response.token) {
          await AsyncStorage.setItem('@GymApp:token', response.token);
          setToken(response.token);
        }

        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Remove apenas os dados do usuário do storage local
      await AsyncStorage.removeItem('@GymApp:user');
      await AsyncStorage.removeItem('@GymApp:token');

      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo se o logout falhar no servidor, limpa o estado local
      await AsyncStorage.removeItem('@GymApp:user');
      await AsyncStorage.removeItem('@GymApp:token');

      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('@GymApp:user');
      const tokenData = await AsyncStorage.getItem('@GymApp:token');

      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        setToken(tokenData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        await AsyncStorage.setItem('@GymApp:user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};