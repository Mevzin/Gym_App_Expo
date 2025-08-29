import { Text, useWindowDimensions, View } from "react-native";
import * as Progress from 'react-native-progress';
import { useEffect, useState } from "react";
import { exerciseService } from "../../services/api";
import { getDayOfWeek } from "../../utils/dateUtils";
import { useCompletedExercises } from "../../contexts/CompletedExercisesContext";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import CardProgressTrainingSkeleton from "./skeleton";


export default function CardProgressTraining() {
    const { completedExercises, refreshCompletedExercises } = useCompletedExercises();
    const [exercises, setExercises] = useState([]);
    const [currentDay, setCurrentDay] = useState('');
    const [dayTitle, setDayTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const { width } = useWindowDimensions()

    useEffect(() => {
        const dayOfWeek = getDayOfWeek();
        setCurrentDay(dayOfWeek);
        setDayTitle(getDayTitle(dayOfWeek));
        loadExercisesData(dayOfWeek);
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (currentDay) {
                loadExercisesData(currentDay);
            }
        }, [currentDay])
    );

    const getDayTitle = (day: string) => {
        switch (day) {
            case 'segunda': return 'Segunda-feira - Pernas';
            case 'terca': return 'Terça-feira - Braços';
            case 'quarta': return 'Quarta-feira - Costas';
            case 'quinta': return 'Quinta-feira - Peito';
            case 'sexta': return 'Sexta-feira - Ombros';
            case 'sabado': return 'Sábado - Abdômen';
            case 'domingo': return 'Domingo - Descanso';
            default: return 'Exercícios do Dia';
        }
    };

    const loadExercisesData = async (day: string) => {
        try {
            setLoading(true);

            const userFile = await exerciseService.checkUserFile();

            if (userFile) {
                const response = await exerciseService.getExercisesByDay(day);
                setExercises(response.exercises || []);

                await refreshCompletedExercises();
            } else {
                setExercises([]);
            }
        } catch (error) {
            console.error('Erro ao carregar dados dos exercícios:', error);
            setExercises([]);
        } finally {
            setLoading(false);
        }
    };

    const totalExercises = exercises.length;
    const completedCount = completedExercises.length;
    const progress = totalExercises > 0 ? completedCount / totalExercises : 0;
    const estimatedTime = totalExercises * 9;

    if (loading) {
        return <CardProgressTrainingSkeleton />;
    }

    if (currentDay === 'domingo') {
        return (
            <View className="w-[95%] h-32 bg-[#4abdd4] my-6 px-5 rounded-xl justify-center">
                <View className="flex-row justify-between mb-5">
                    <View>
                        <Text className="text-white font-extrabold text-2xl">{dayTitle}</Text>
                        <Text className="text-white font-extralight">Dia de descanso</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-white font-extrabold text-3xl">😴</Text>
                        <Text className="text-white font-extralight">rest day</Text>
                    </View>
                </View>
                <Progress.Bar progress={1} width={340} animated={true} color="#ffffff" borderColor="gray" borderWidth={0.2} height={10} />
            </View>
        );
    }

    if (totalExercises === 0) {
        return (
            <View className="w-[95%] h-32 bg-[#697f84] my-6 px-5 rounded-xl justify-center">
                <View className="flex-row justify-between mb-5">
                    <View>
                        <Text className="text-white font-extrabold text-2xl">{dayTitle}</Text>
                        <Text className="text-white font-extralight">Nenhum exercício configurado</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-white font-extrabold text-3xl">0/0</Text>
                        <Text className="text-white font-extralight">completed</Text>
                    </View>
                </View>
                <Progress.Bar progress={0} width={340} animated={true} color="#4abdd4" borderColor="gray" borderWidth={0.2} height={10} />
            </View>
        );
    }

    const isCompleted = completedCount === totalExercises;
    const cardColor = isCompleted ? "#0a943d" : "#c21409";

    return (
        <View className="w-[95%] h-32 my-6 px-5 rounded-xl justify-center" style={{ backgroundColor: cardColor }}>
            <View className="flex-row justify-between mb-5">
                <View>
                    <Text className="text-white font-extrabold text-2xl">{dayTitle}</Text>
                    <Text className="text-white font-extralight">{totalExercises} exercícios - {estimatedTime} min</Text>
                </View>

                <View className="items-end">
                    <Text className="text-white font-extrabold text-3xl">{completedCount}/{totalExercises}</Text>
                    <Text className="text-white font-extralight">completed</Text>
                </View>
            </View>
            <Progress.Bar
                progress={progress}
                width={width / 1.16}
                animated={true}
                color="#4abdd4"
                borderColor="gray"
                borderWidth={0.2}
                height={10}
                unfilledColor="#384152"
            />
        </View>
    );
}