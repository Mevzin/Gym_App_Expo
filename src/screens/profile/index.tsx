import { SafeAreaView, ScrollView, Text, View, Alert, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import Button from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/api";
import api from "../../services/api";
import { useNavigation } from '@react-navigation/native';
import { BodyMeasurements, MeasurementsForm } from "../../components/BodyMeasurements";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { logger } from '../../utils/logger';
import { formatStripePrice } from '../../utils/priceUtils';

export default function Profile() {
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showMeasurementsForm, setShowMeasurementsForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [measurementsData, setMeasurementsData] = useState<any>(null);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadData = async () => {
            await loadUserData();
            await loadSubscriptionData();
        };
        loadData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            if (user) {
                setUserData(user);
            } else {
                const localUser = await authService.getCurrentUser();
                setUserData(localUser);
            }
            setLoading(false);

            try {
                const serverUser = await authService.getCurrentUserFromServer();
                setUserData(serverUser);
            } catch (serverError) {
                logger.log('Usando dados locais - servidor indisponível');
            }
        } catch (error) {
            logger.error('Erro ao carregar dados do usuário:', error);
            setLoading(false);
        }
    };

    const loadSubscriptionData = async () => {
        try {
            const token = await AsyncStorage.getItem('@GymApp:token');
            const userDataLocal = await AsyncStorage.getItem('@GymApp:user');
            const currentUser = userDataLocal ? JSON.parse(userDataLocal) : user;
            const userId = currentUser?.id || currentUser?._id;

            if (!userId || !token) {
                logger.log('Usuário ou token não encontrado para buscar assinatura');
                return;
            }

            const response = await api.get(`/payment/subscription/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.subscription) {
                setSubscriptionData(response.data.subscription);
            } else {
                logger.log('Nenhuma assinatura encontrada para o usuário');
            }
        } catch (error) {
            logger.error('Erro ao carregar dados de assinatura:', error);
        }
    };



    const handleLogout = () => {
        Alert.alert(
            'Confirmar Saída',
            'Tem certeza que deseja sair da sua conta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                            navigation.navigate('Login' as never);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível fazer logout');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-dark">
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-lg font-roboto">Carregando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-dark ">
            <ScrollView
                className="bg-primary"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center">
                    <View className="w-[95%] mt-5 items-center">
                        <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center mb-2">
                            <FontAwesome
                                name="user"
                                size={50}
                                color={"#FFF"}
                            />
                        </View>
                        <Text className="text-white font-bold text-2xl font-roboto">{userData?.name || 'Usuário'}</Text>
                        <Text className="text-gray-400 font-bold font-roboto">
                            {userData?.role === 'admin' ? 'Administrador' :
                                userData?.role === 'personal' ? 'Personal Trainer' : 'Membro'}
                        </Text>



                        <View className="w-full mt-8">
                            <Text className="text-white font-bold text-xl mb-3 font-roboto">Personal Information</Text>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold font-roboto">Nome Completo</Text>
                                        <Text className="text-white font-bold text-lg font-roboto">{userData?.name || 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold font-roboto">Email</Text>
                                        <Text className="text-white font-bold text-lg font-roboto">{userData?.email || 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>

                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold font-roboto">Idade</Text>
                                        <Text className="text-white font-bold text-lg font-roboto">{userData?.age ? `${userData.age} anos` : 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                        </View>

                        <View className="w-full mt-5">
                            {showMeasurementsForm ? (
                                <MeasurementsForm
                                    initialData={measurementsData}
                                    onSave={() => {
                                        setShowMeasurementsForm(false);
                                        loadUserData();
                                        setRefreshTrigger(prev => prev + 1);
                                    }}
                                    onCancel={() => setShowMeasurementsForm(false)}
                                />
                            ) : (
                                <BodyMeasurements
                                    editable={true}
                                    onEdit={(measurements) => {
                                        setMeasurementsData(measurements);
                                        setShowMeasurementsForm(true);
                                    }}
                                    refreshTrigger={refreshTrigger}
                                />
                            )}
                        </View>

                        <View className="w-full mt-5">
                            <Text className="text-white font-bold text-xl mb-3 font-roboto">Informações da Conta</Text>
                            <View className="bg-secondary rounded-lg p-4">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-gray-400 font-bold font-roboto">Tipo de Conta</Text>
                                    <Text className="text-white font-bold font-roboto">
                                        {userData?.role === 'admin' ? 'Administrador' :
                                            userData?.role === 'personal' ? 'Personal Trainer' : 'Usuário'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-gray-400 font-bold font-roboto">Status</Text>
                                    <Text className="text-green-500 font-bold font-roboto">Ativo</Text>
                                </View>


                                {subscriptionData ? (
                                    <>
                                        <View className="flex-row justify-between items-center mb-3">
                                            <Text className="text-gray-400 font-bold font-roboto">Status da Assinatura</Text>
                                            <Text className={`font-bold font-roboto ${subscriptionData.status === 'active' ? 'text-green-500' :
                                                subscriptionData.status === 'canceled' || subscriptionData.status === 'inactive' ? 'text-red-500' :
                                                    subscriptionData.status === 'incomplete' || subscriptionData.status === 'incomplete_expired' ? 'text-yellow-500' :
                                                        subscriptionData.status === 'trialing' ? 'text-blue-500' :
                                                            'text-gray-400'
                                                }`}>
                                                {subscriptionData.status === 'active' ? 'Ativo' :
                                                    subscriptionData.status === 'canceled' ? 'Cancelado' :
                                                        subscriptionData.status === 'inactive' ? 'Inativo' :
                                                            subscriptionData.status === 'incomplete' ? 'Incompleto' :
                                                                subscriptionData.status === 'incomplete_expired' ? 'Incompleto (Expirado)' :
                                                                    subscriptionData.status === 'trialing' ? 'Período de Teste' :
                                                                        subscriptionData.status}
                                            </Text>
                                        </View>

                                        {subscriptionData?.planName && (
                                            <View className="flex-row justify-between items-center mb-3">
                                                <Text className="text-gray-400 font-bold font-roboto">Plano</Text>
                                                <Text className="text-white font-bold font-roboto">{subscriptionData.planName}</Text>
                                            </View>
                                        )}

                                        {subscriptionData?.currentPeriodEnd && (
                                            <View className="flex-row justify-between items-center mb-3">
                                                <Text className="text-gray-400 font-bold font-roboto">Próxima Cobrança</Text>
                                                <Text className="text-white font-bold font-roboto">
                                                    {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString('pt-BR')}
                                                </Text>
                                            </View>
                                        )}

                                        {subscriptionData?.planPrice && (
                                            <View className="flex-row justify-between items-center mb-3">
                                                <Text className="text-gray-400 font-bold font-roboto">Valor</Text>
                                                <Text className="text-white font-bold font-roboto">
                                                    {formatStripePrice(subscriptionData.planPrice, subscriptionData.currency || 'BRL')}/{subscriptionData.interval === 'month' ? 'mês' : 'ano'}
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-gray-400 font-bold font-roboto">Status da Assinatura</Text>
                                        <Text className="text-gray-400 font-bold font-roboto">Nenhuma assinatura ativa</Text>
                                    </View>
                                )}

                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-gray-400 font-bold font-roboto">Membro desde</Text>
                                    <Text className="text-white font-bold font-roboto">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-400 font-bold font-roboto">Última atualização</Text>
                                    <Text className="text-white font-bold font-roboto">{userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</Text>
                                </View>
                            </View>
                        </View>



                        <View className="w-full mt-5 mb-8">
                            <Text className="text-white font-bold text-xl mb-3 font-roboto">Preferences</Text>
                            <View className="w-full bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="notifications" size={24} color="#4abdd4" />
                                        <Text className="text-white font-bold text-lg ml-2 font-roboto">Notifications</Text>
                                    </View>
                                    <View className="w-12 h-6 bg-[#4abdd4] rounded-full items-end p-1">
                                        <View className="w-4 h-4 bg-white rounded-full" />
                                    </View>
                                </View>
                            </View>
                            <View className="w-full bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="nightlight-round" size={24} color="#4abdd4" />
                                        <Text className="text-white font-bold text-lg ml-2 font-roboto">Dark Mode</Text>
                                    </View>
                                    <View className="w-12 h-6 bg-[#4abdd4] rounded-full items-end p-1">
                                        <View className="w-4 h-4 bg-white rounded-full" />
                                    </View>
                                </View>
                            </View>
                            <View className="w-full bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="privacy-tip" size={24} color="#4abdd4" />
                                        <Text className="text-white font-bold text-lg ml-2 font-roboto">Privacy Settings</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </View>
                        </View>


                        <View className="w-full mt-8 mb-6">
                            {(userData?.role === 'personal' || userData?.role === 'admin') && (
                                <TouchableOpacity
                                    className="w-full bg-orange-500 rounded-lg p-4 items-center mb-4"
                                    onPress={() => navigation.navigate('PersonalDashboard' as never)}
                                >
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="people" size={24} color="white" />
                                        <Text className="text-white font-bold text-lg ml-2 font-roboto">Gerenciar Usuários</Text>
                                    </View>
                                </TouchableOpacity>
                            )}



                            <TouchableOpacity
                                className="w-full bg-[#4abdd4] rounded-lg p-4 items-center mb-4"
                                onPress={() => navigation.navigate('EditWorkout' as never)}
                            >
                                <View className="flex-row items-center">
                                    <MaterialIcons name="edit" size={24} color="white" />
                                    <Text className="text-white font-bold text-lg ml-2 font-roboto">Editar Treino</Text>
                                </View>
                            </TouchableOpacity>

                            {!subscriptionData || !['active', 'trialing'].includes(subscriptionData.status) ? (
                                <TouchableOpacity
                                    className="w-full bg-purple-600 rounded-lg p-4 items-center mb-4"
                                    onPress={() => navigation.navigate('Subscription' as never)}
                                >
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="star" size={24} color="white" />
                                        <Text className="text-white font-bold text-lg ml-2 font-roboto">Assinatura Premium</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : null}

                            <TouchableOpacity
                                className="w-full bg-red-600 rounded-lg p-4 items-center"
                                onPress={handleLogout}
                            >
                                <View className="flex-row items-center">
                                    <MaterialIcons name="logout" size={24} color="white" />
                                    <Text className="text-white font-bold text-lg ml-2 font-roboto">Sair da Conta</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}