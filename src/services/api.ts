import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_TIMEOUT } from '@env';

const api = axios.create({
    baseURL: API_URL,
    timeout: parseInt(API_TIMEOUT) || 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@GymApp:token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const authService = {

    login: async (email: string, password: string) => {
        try {
            console.log('🌐 API: Fazendo requisição de login para:', email);
            console.log('🌐 API: URL da requisição:', `${API_URL}/user/login`);
            
            const response = await api.post('/user/login', { email, password });
            console.log('🌐 API: Resposta recebida:', response.data);
            
            if (response.data.token) {
                console.log('🌐 API: Token recebido, salvando no AsyncStorage...');
                await AsyncStorage.setItem('@GymApp:token', response.data.token);
                await AsyncStorage.setItem('@GymApp:user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('🌐 API: Erro na requisição de login:', error);
            if (error.response) {
                console.error('🌐 API: Status do erro:', error.response.status);
                console.error('🌐 API: Dados do erro:', error.response.data);
            }
            throw error;
        }
    },


    register: async (userData: any) => {
        try {
            const response = await api.post('/user/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    logout: async () => {
        try {
            await AsyncStorage.removeItem('@GymApp:user');
            await AsyncStorage.removeItem('@GymApp:token');
        } catch (error) {
            throw error;
        }
    },


    isAuthenticated: async () => {
        const token = await AsyncStorage.getItem('@GymApp:token');
        return !!token;
    },


    getCurrentUser: async () => {
        try {
            const userString = await AsyncStorage.getItem('@GymApp:user');
            if (userString) {
                return JSON.parse(userString);
            }
            return null;
        } catch (error) {
            return null;
        }
    },


    getCurrentUserFromServer: async () => {
        try {
            const response = await api.get('/user/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export const exerciseService = {

    getExercises: async (fileId: string) => {
        try {
            const response = await api.get(`/file/getFileById/${fileId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    getExercisesByUserId: async (userId: any) => {
        try {
            const response = await api.get(`/file/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    getExercisesByDay: async (day: any) => {
        try {
            const userString = await AsyncStorage.getItem('@GymApp:user');
            let userId = null;

            if (userString) {
                const user = JSON.parse(userString);
                userId = user._id || user.id;
            }

            if (!userId) {
                throw new Error('Usuário não encontrado');
            }
            const response = await api.get(`/files/day/${day}/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateExercisesByDay: async (day: string, exercises: any[]) => {
        try {
            const userString = await AsyncStorage.getItem('@GymApp:user');
            let userId = null;

            if (userString) {
                const user = JSON.parse(userString);
                userId = user._id || user.id;
            }

            if (!userId) {
                throw new Error('Usuário não encontrado');
            }
            const response = await api.put(`/files/day/${day}`, { userId, exercises });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markExerciseAsCompleted: async (exerciseId: string) => {
        try {
            const response = await api.put(`/files/exercise/${exerciseId}/complete`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markExerciseAsCompletedByNameAndDay: async (exerciseName: string, day: string) => {
        try {
            const userString = await AsyncStorage.getItem('@GymApp:user');
            let userId = null;

            if (userString) {
                const user = JSON.parse(userString);
                userId = user._id || user.id;
            }

            if (!userId) {
                throw new Error('Usuário não encontrado');
            }
            const response = await api.put(`/files/exercise/complete`, { exerciseName, day, userId });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkUserFile: async () => {
        try {
            const userString = await AsyncStorage.getItem('@GymApp:user');
            let userId = null;

            if (userString) {
                const user = JSON.parse(userString);
                userId = user._id || user.id;
            }

            if (!userId) {
                throw new Error('Usuário não encontrado');
            }

            const response = await api.post('/files/getFileByUserId', { userId });
            return response.data.file;
        } catch (error) {
            return null;
        }
    },

    createFile: async (exerciseData: any) => {
        try {

            const userString = await AsyncStorage.getItem('@GymApp:user');
            let userId = null;

            if (userString) {
                const user = JSON.parse(userString);
                userId = user._id || user.id;
            }

            if (!userId) {
                throw new Error('Usuário não encontrado');
            }
            const response = await api.post('/files/createFile', {
                userId,
                ...exerciseData
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateFile: async (exerciseData: any) => {
        try {
            const userString = await AsyncStorage.getItem('@GymApp:user');
            let userId = null;

            if (userString) {
                const user = JSON.parse(userString);
                userId = user._id || user.id;
            }

            if (!userId) {
                throw new Error('Usuário não encontrado');
            }

            let userFile = await exerciseService.checkUserFile();

            if (!userFile || !userFile._id) {
                userFile = await exerciseService.createFile(exerciseData);
                return userFile;
            }


            const response = await api.put(`/files/updateFileById/${userFile._id}`, {
                userId,
                ...exerciseData
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default api;