import { SafeAreaView, ScrollView, Text, View } from "react-native";
import CardProfile from "../../components/CardProfile";
import { MaterialIcons } from "@expo/vector-icons";
import * as ProgressBar from 'react-native-progress';
import { useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { progressService, ProgressData } from '../../services/progressService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function Progress() {
    const { width } = useWindowDimensions();
    const [progressData, setProgressData] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProgressData = async () => {
        try {
            setLoading(true);
            const data = await progressService.getProgress();
            setProgressData(data);
        } catch (error) {
            console.error('Erro ao carregar dados de progresso:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProgressData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadProgressData();
        }, [])
    );

    if (loading || !progressData) {
        return (
            <SafeAreaView className="flex-1 bg-dark">
                <ScrollView className="bg-primary" showsVerticalScrollIndicator={false}>
                    <View className="items-center">
                        <CardProfile />
                        <View className="w-[95%] mt-2">
                            <Text className="text-white font-bold text-2xl">Carregando...</Text>
                        </View>
                    </View>
                </ScrollView>
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
                    <CardProfile />
                    <View className="w-[95%] mt-2">
                        <Text className="text-white font-bold text-2xl ">Visão Geral do Progresso</Text>
                        <View className="flex-row justify-between mt-4">
                            <View className="bg-secondary w-[48%] h-36 rounded-lg justify-center">
                                <View className="flex-row justify-between mx-5 items-center">
                                    <MaterialIcons
                                        name="search"
                                        size={30}
                                        color={"cyan"}
                                    />
                                    <Text className="text-green-500 font-bold text-xl">{progressData?.weightLoss?.change > 0 ? '+' : ''}{progressData?.weightLoss?.change?.toFixed(1) || '0.0'}kg</Text>
                                </View>
                                <View className="mx-5">
                                    <Text className="text-gray-400 font-light mt-5">Perda de Peso</Text>
                                    <Text className="text-white font-bold text-2xl">{progressData?.weightLoss?.current?.toFixed(1) || '0.0'} kg</Text>
                                </View>
                            </View>
                            <View className="bg-secondary w-[48%] h-36 rounded-lg justify-center">
                                <View className="flex-row justify-between mx-5 items-center">
                                    <MaterialIcons
                                        name="search"
                                        size={30}
                                        color={"red"}
                                    />
                                    <Text className="text-green-500 font-bold text-xl">{progressData?.caloriesBurned?.change > 0 ? '+' : ''}{progressData?.caloriesBurned?.change || 0}%</Text>
                                </View>
                                <View className="mx-5">
                                    <Text className="text-gray-400 font-light mt-5">Calorias Queimadas</Text>
                                    <Text className="text-white font-bold text-2xl">{progressData?.caloriesBurned?.total?.toLocaleString() || '0'}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="w-full h-36 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <Text className="text-white font-bold text-xl">Esta Semana</Text>
                                <MaterialIcons
                                    name="search"
                                    size={30}
                                    color={"#4abdd4"}
                                />
                            </View>
                            <View className="mt-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-400 font-bold text-xl mb-3">Treinos Concluídos</Text>
                                    <Text className="text-white font-bold text-xl mb-3">{progressData?.thisWeek?.workoutsCompleted || 0}/{progressData?.thisWeek?.totalWorkouts || 0}</Text>
                                </View>
                                <ProgressBar.Bar
                                    progress={progressData?.thisWeek?.progress || 0}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4abdd4"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                    </View>
                    <View className="w-[95%] mt-2">
                        <Text className="text-white font-bold text-2xl mt-5">Métricas de Performance</Text>
                        <View className="w-full h-28 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="favorite"
                                        size={30}
                                        color={"#4abdd4"}
                                    />
                                    <Text className="text-white font-bold text-xl  ml-2">Resistência Cardio</Text>
                                </View>

                                <Text className="text-green-500 font-bold text-xl">{progressData?.performanceMetrics?.cardioEndurance?.change > 0 ? '+' : ''}{progressData?.performanceMetrics?.cardioEndurance?.change || 0}%</Text>
                            </View>
                            <View className="mt-3">
                                <ProgressBar.Bar
                                    progress={(progressData?.performanceMetrics?.cardioEndurance?.value || 0) / 100}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4abdd4"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                        <View className="w-full h-28 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="fitness-center"
                                        size={30}
                                        color={"#b7190f"}
                                    />
                                    <Text className="text-white font-bold text-xl  ml-2">Treinamento de Força</Text>
                                </View>
                                <Text className="text-green-500 font-bold text-xl">{progressData?.performanceMetrics?.strengthTraining?.change > 0 ? '+' : ''}{progressData?.performanceMetrics?.strengthTraining?.change || 0}%</Text>
                            </View>
                            <View className="mt-3">
                                <ProgressBar.Bar
                                    progress={(progressData?.performanceMetrics?.strengthTraining?.value || 0) / 100}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#b7190f"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                        <View className="w-full h-28 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="accessibility"
                                        size={30}
                                        color={"#4cdc80"}
                                    />
                                    <Text className="text-white font-bold text-xl  ml-2">Flexibilidade</Text>
                                </View>

                                <Text className="text-green-500 font-bold text-xl">{progressData?.performanceMetrics?.flexibility?.change > 0 ? '+' : ''}{progressData?.performanceMetrics?.flexibility?.change || 0}%</Text>
                            </View>
                            <View className="mt-3">
                                <ProgressBar.Bar
                                    progress={(progressData?.performanceMetrics?.flexibility?.value || 0) / 100}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4cdc80"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                    </View>
                    <View className="w-[95%] mt-2">
                        <Text className="text-white font-bold text-2xl mt-5">Conquistas Recentes</Text>
                        {progressData?.recentAchievements?.length > 0 ? (
                            progressData.recentAchievements.slice(0, 2).map((achievement, index) => (
                                <View key={index} className="w-full h-20 mt-3 rounded-lg bg-secondary px-5 justify-center">
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <View className="w-12 h-12 rounded-full bg-[#4abdd4] items-center justify-center mr-3">
                                                <Text className="text-white text-xl">{achievement.icon}</Text>
                                            </View>
                                            <View>
                                                <Text className="text-white font-bold text-lg">{achievement.title}</Text>
                                                <Text className="text-gray-400 font-light text-sm">{achievement.description}</Text>
                                            </View>
                                        </View>
                                        <Text className="text-gray-400 font-light text-xs">{new Date(achievement.achievedAt).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="w-full h-20 mt-3 rounded-lg bg-secondary px-5 justify-center">
                                <Text className="text-gray-400 font-light text-center">Nenhuma conquista recente</Text>
                            </View>
                        )}
                    </View>
                    <View className="w-[95%] mt-2">
                        <Text className="text-white font-bold text-2xl mt-5">Metas Mensais</Text>
                        <View className="w-full h-32 my-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-400 font-bold text-lg">Perder {progressData?.monthlyGoals?.weightLoss?.target || 0}kg</Text>
                                </View>
                                <Text className="text-white font-bold text-lg">{progressData?.monthlyGoals?.weightLoss?.current?.toFixed(1) || '0.0'}/{progressData?.monthlyGoals?.weightLoss?.target?.toFixed(1) || '0.0'} kg</Text>
                            </View>
                            <View className="mt-1 mb-2">
                                <ProgressBar.Bar
                                    progress={progressData?.monthlyGoals?.weightLoss?.progress || 0}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4abdd4"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-400 font-bold text-lg">{progressData?.monthlyGoals?.workouts?.target || 0} Treinos</Text>
                                </View>

                                <Text className="text-white font-bold text-lg">{progressData?.monthlyGoals?.workouts?.current || 0}/{progressData?.monthlyGoals?.workouts?.target || 0}</Text>
                            </View>
                            <View className="mt-1">
                                <ProgressBar.Bar
                                    progress={progressData?.monthlyGoals?.workouts?.progress || 0}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#b41b12"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}