import { Text, View, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import CardExerciseLarge from "../CardExerciseLarge";
import { useEffect, useState } from "react";
import { exerciseService } from "../../services/api";
import { getDayOfWeek } from "../../utils/dateUtils";
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useCompletedExercises } from "../../contexts/CompletedExercisesContext";
import { CompletedExercisesStorage } from "../../services/completedExercisesStorage";
import ExercisesListSkeleton from "./skeleton";
import { logger } from "../../utils/logger";
import { useAuth } from "../../contexts/AuthContext";


export default function ExercisesList() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDay, setCurrentDay] = useState('');
    const [hasUserFile, setHasUserFile] = useState<boolean | null>(null);
    const navigation = useNavigation();
    const { refreshCompletedExercises } = useCompletedExercises();
    const { user } = useAuth();

    useEffect(() => {
        const dayOfWeek = getDayOfWeek();
        setCurrentDay(dayOfWeek);

        initializeApp(dayOfWeek);
    }, []);

    const initializeApp = async (day: string) => {
        if (user?.id) {
            await CompletedExercisesStorage.cleanOldCompletedExercises(user.id);
        }
        await refreshCompletedExercises();
        checkUserFileAndLoadExercises(day);
    };

    useFocusEffect(
        useCallback(() => {
            if (currentDay) {
                const refreshData = async () => {
                    if (user?.id) {
                        await CompletedExercisesStorage.cleanOldCompletedExercises(user.id);
                    }
                    await refreshCompletedExercises();
                    checkUserFileAndLoadExercises(currentDay);
                };
                refreshData();
            }
        }, [currentDay, refreshCompletedExercises, user?.id])
    );

    const checkUserFileAndLoadExercises = async (day: any) => {
        try {
            setLoading(true);

            const userFile = await exerciseService.checkUserFile();
            setHasUserFile(!!userFile);

            if (userFile) {
                const response = await exerciseService.getExercisesByDay(day);
                setExercises(response.exercises || []);
            } else {
                setExercises([]);
            }
        } catch (error) {
            logger.error('Erro ao carregar exercícios:', error);
            Alert.alert('Erro', 'Não foi possível carregar os exercícios.');
            setHasUserFile(false);
        } finally {
            setLoading(false);
        }
    };

    const loadExercises = async (day: any) => {
        try {
            setLoading(true);
            const response = await exerciseService.getExercisesByDay(day);
            setExercises(response.exercises || []);
        } catch (error) {
            console.error('Erro ao carregar exercícios:', error);
            Alert.alert('Erro', 'Não foi possível carregar os exercícios.');
        } finally {
            setLoading(false);
        }
    };

    const createDefaultExercises = async () => {
        try {
            setLoading(true);

            let defaultExercises: string[] = [];

            switch (currentDay) {
                case 'segunda':
                    defaultExercises = ['agachamentoLivre', 'legPress', 'cadeiraExtensora', 'cadeiraFlexora', 'panturrilhaEmPe'];
                    break;
                case 'terca':
                    defaultExercises = ['roscaDireta', 'roscaAlternada', 'tricepsTesta', 'tricepsCorda', 'tricepsBanco'];
                    break;
                case 'quarta':
                    defaultExercises = ['puxadaFrente', 'remadaCurvada', 'puxadaAlta', 'barraFixa', 'levantamentoTerraCostas'];
                    break;
                case 'quinta':
                    defaultExercises = ['supinoReto', 'supinoInclinado', 'crucifixoReto', 'peckDeck', 'pullover'];
                    break;
                case 'sexta':
                    defaultExercises = ['desenvolvimentoBarra', 'elevacaoLateral', 'elevacaoFrontal', 'encolhimentoOmbros', 'arnoldPress'];
                    break;
                case 'sabado':
                    defaultExercises = ['abdominalSupra', 'abdominalInfra', 'prancha', 'elevacaoDePernas', 'bicicletaNoAr'];
                    break;
                default:
                    defaultExercises = [];
            }

            await exerciseService.updateExercisesByDay(currentDay, defaultExercises);

            await checkUserFileAndLoadExercises(currentDay);

            Alert.alert('Sucesso', 'Exercícios criados com sucesso!');
        } catch (error) {
            logger.error('Erro ao criar exercícios:', error);
            Alert.alert('Erro', 'Não foi possível criar os exercícios padrão.');
        } finally {
            setLoading(false);
        }
    };

    const getDayTitle = () => {
        return 'Treino de hoje';
    };


    return (
        <View className="w-[95%]">
            <Text className="text-white text-2xl font-extrabold">{getDayTitle()}</Text>

            {loading ? (
                <ExercisesListSkeleton />
            ) : exercises.length > 0 ? (
                exercises.map((exercise, index) => (
                    <CardExerciseLarge
                        key={index}
                        name={(exercise as any).name}
                        value={(exercise as any).value}
                    />
                ))
            ) : (
                <View className="items-center justify-center py-10">
                    {hasUserFile === false ? (
                        <>
                            <Text className="text-white text-lg">Você ainda não possui um treino configurado</Text>
                            <TouchableOpacity
                                className="mt-6 bg-[#4abdd4] py-3 px-6 rounded-full flex-row items-center"
                                onPress={() => navigation.navigate('WorkoutConfiguration' as never)}
                            >
                                <Feather name="settings" size={20} color="white" />
                                <Text className="text-white font-bold ml-2">Criar Padrão de Treino</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text className="text-white text-lg">Nenhum exercício para hoje.</Text>
                            <Text className="text-white/70 text-sm mt-2">
                                {currentDay === 'domingo' ? 'Aproveite seu dia de descanso!' : 'Adicione exercícios para este dia.'}
                            </Text>

                            {currentDay !== 'domingo' && (
                                <TouchableOpacity
                                    className="mt-6 bg-[#4abdd4] py-3 px-6 rounded-full flex-row items-center"
                                    onPress={createDefaultExercises}
                                >
                                    <Feather name="plus-circle" size={20} color="white" />
                                    <Text className="text-white font-bold ml-2">Criar Exercícios Padrão</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            )}
        </View>
    )
}