import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useEffect, useState, useCallback } from 'react';
import { progressService, ProgressData } from '../../services/progressService';
import { useFocusEffect } from '@react-navigation/native';
import { logger } from "../../utils/logger";

export default function CardHero() {
    const [progressData, setProgressData] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProgressData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await progressService.getProgress();
            setProgressData(data);
        } catch (error) {
            logger.error('Erro ao carregar dados de progresso:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadProgressData();
        }, [loadProgressData])
    );

    const workoutsCompleted = progressData?.thisWeek?.workoutsCompleted || 0;
    const totalHours = progressData ? Math.round((progressData.caloriesBurned.total / 100) * 10) / 10 : 0;

    return (
        <View className="w-full items-center">
            <View className="flex items-center my-6">
                <Text className="text-white text-4xl font-extrabold font-roboto">Sua jornada fitness</Text>
                <Text className="text-gray-400 font-bold font-roboto">Acompanhar o progresso, atingir metas!</Text>
            </View>
            <View className="flex-row w-[95%] justify-evenly">
                <View className="flex-row bg-secondary w-[45%] h-[80px] rounded-md items-center justify-evenly">
                    <View className="items-center">
                        <Text className="text-cyan-400 font-extrabold text-2xl font-roboto">
                            {loading ? '--' : workoutsCompleted}
                        </Text>
                        <Text className="text-gray-400 font-bold font-roboto">Workouts</Text>
                    </View>
                    <View>
                        <MaterialCommunityIcons
                            name="weight-lifter"
                            size={40}
                            color={"#9d1e1d"}
                        />
                    </View>
                </View>
                <View className="flex-row bg-secondary w-[45%] h-[80px] rounded-md items-center justify-evenly">
                    <View className="items-center">
                        <Text className="text-cyan-400 font-extrabold text-2xl font-roboto">
                            {loading ? '--' : totalHours}
                        </Text>
                        <Text className="text-gray-400 font-bold font-roboto">Hours</Text>
                    </View>
                    <View>
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={40}
                            color={"#9d1e1d"}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}