import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_TIMEOUT } from '@env';

console.log(API_URL);

const api = axios.create({
    // baseURL: 'https://r3fitnesscenter.squareweb.app/api/v1',
    baseURL: 'http://192.168.0.5:3333/api/v1',
    timeout: parseInt(API_TIMEOUT) || 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@GymApp:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Se já está fazendo refresh, adiciona a requisição na fila
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Busca o refresh token do AsyncStorage
                const userData = await AsyncStorage.getItem('@GymApp:user');
                const refreshToken = userData ? JSON.parse(userData).refreshToken : null;

                if (!refreshToken) {
                    throw new Error('Refresh token não encontrado');
                }

                const response = await api.post('/user/refresh', {}, {
                    headers: {
                        'X-Refresh-Token': refreshToken
                    }
                });

                const { accessToken, refreshToken: newRefreshToken, user } = response.data;

                // Atualiza o token no AsyncStorage
                await AsyncStorage.setItem('@GymApp:token', accessToken);

                // Atualiza o usuário com o novo refresh token
                const updatedUser = { ...user, refreshToken: newRefreshToken };
                await AsyncStorage.setItem('@GymApp:user', JSON.stringify(updatedUser));

                // Processa a fila de requisições pendentes
                processQueue(null, accessToken);

                // Refaz a requisição original com o novo token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                await AsyncStorage.removeItem('@GymApp:user');
                await AsyncStorage.removeItem('@GymApp:token');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {

    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/user/login', { email, password });

            console.log(response.data);

            // Salva os dados do usuário e tokens
            if (response.data.user && response.data.accessToken && response.data.refreshToken) {
                const userWithRefreshToken = {
                    ...response.data.user,
                    refreshToken: response.data.refreshToken
                };

                await AsyncStorage.setItem('@GymApp:user', JSON.stringify(userWithRefreshToken));
                await AsyncStorage.setItem('@GymApp:token', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData: any) => {
        try {
            const response = await api.post('/user/register', userData);
            console.log(userData);

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            // Chama o endpoint de logout no backend para limpar os cookies
            await api.post('/auth/logout');

            // Remove apenas os dados do usuário do storage local
            await AsyncStorage.removeItem('@GymApp:user');
        } catch (error) {
            // Mesmo se der erro no backend, limpa o storage local
            await AsyncStorage.removeItem('@GymApp:user');
            throw error;
        }
    },

    isAuthenticated: async () => {
        try {
            // Verifica autenticação fazendo uma requisição que requer autenticação
            const response = await api.get('/auth/verify');
            return response.status === 200;
        } catch (error) {
            return false;
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


    getExercisesByDay: async (day: any, userId: string) => {
        try {
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