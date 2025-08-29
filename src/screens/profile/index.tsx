import { SafeAreaView, ScrollView, Text, View, Alert, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Button from "../../components/ui/button";
import { authService } from "../../services/api";
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
    const { width } = useWindowDimensions();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const user = await authService.getCurrentUserFromServer();
            setUserData(user);
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
    
            const localUser = await authService.getCurrentUser();
            setUserData(localUser);
        } finally {
            setLoading(false);
        }
    };

    const formatHeight = (height: number) => {
        if (!height) return 'Não informado';
        const feet = Math.floor(height / 30.48);
        const inches = Math.round((height % 30.48) / 2.54);
        return `${feet}'${inches}" (${height}cm)`;
    };

    const calculateBMI = (weight: number, height: number) => {
        if (!weight || !height) return 'N/A';
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
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
                            await authService.logout();
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
                    <Text className="text-white text-lg">Carregando...</Text>
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
                        <Text className="text-white font-bold text-2xl">{userData?.name || 'Usuário'}</Text>
                        <Text className="text-gray-400 font-bold">{userData?.role === 'admin' ? 'Administrador' : 'Membro'}</Text>



                        <View className="w-full mt-8">
                            <Text className="text-white font-bold text-xl mb-3">Personal Information</Text>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Nome Completo</Text>
                                        <Text className="text-white font-bold text-lg">{userData?.name || 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Email</Text>
                                        <Text className="text-white font-bold text-lg">{userData?.email || 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Usuário</Text>
                                        <Text className="text-white font-bold text-lg">{userData?.username || 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Idade</Text>
                                        <Text className="text-white font-bold text-lg">{userData?.age ? `${userData.age} anos` : 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                        </View>

                        <View className="w-full mt-5">
                            <Text className="text-white font-bold text-xl mb-3">Métricas Físicas</Text>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Peso</Text>
                                        <Text className="text-white font-bold text-lg">{userData?.weight ? `${userData.weight} kg` : 'Não informado'}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Altura</Text>
                                        <Text className="text-white font-bold text-lg">{formatHeight(userData?.height)}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">IMC</Text>
                                        <Text className="text-white font-bold text-lg">{calculateBMI(userData?.weight, userData?.height)}</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>

                        </View>

                        <View className="w-full mt-5">
                            <Text className="text-white font-bold text-xl mb-3">Informações da Conta</Text>
                            <View className="bg-secondary rounded-lg p-4">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-gray-400 font-bold">Tipo de Conta</Text>
                                    <Text className="text-white font-bold">{userData?.role === 'admin' ? 'Administrador' : 'Usuário'}</Text>
                                </View>
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-gray-400 font-bold">Status</Text>
                                    <Text className="text-green-500 font-bold">Ativo</Text>
                                </View>
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-gray-400 font-bold">Membro desde</Text>
                                    <Text className="text-white font-bold">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-400 font-bold">Última atualização</Text>
                                    <Text className="text-white font-bold">{userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</Text>
                                </View>
                            </View>
                        </View>

                        <View className="w-full mt-5 mb-8">
                            <Text className="text-white font-bold text-xl mb-3">Preferences</Text>
                            <View className="w-full bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="notifications" size={24} color="#4abdd4" />
                                        <Text className="text-white font-bold text-lg ml-2">Notifications</Text>
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
                                        <Text className="text-white font-bold text-lg ml-2">Dark Mode</Text>
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
                                        <Text className="text-white font-bold text-lg ml-2">Privacy Settings</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </View>
                        </View>

        
                        <View className="w-full mt-8 mb-6">
                            <TouchableOpacity 
                                className="w-full bg-red-600 rounded-lg p-4 items-center"
                                onPress={handleLogout}
                            >
                                <View className="flex-row items-center">
                                    <MaterialIcons name="logout" size={24} color="white" />
                                    <Text className="text-white font-bold text-lg ml-2">Sair da Conta</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}