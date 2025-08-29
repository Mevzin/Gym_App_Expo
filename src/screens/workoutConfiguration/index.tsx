import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { exerciseService } from '../../services/api';

interface Exercise {
    name: string;
    displayName: string;
    category: string;
    sets: string;
}

interface ExerciseCategory {
    name: string;
    displayName: string;
    exercises: Exercise[];
}

export function WorkoutConfiguration() {
    const navigation = useNavigation();
    const [categories, setCategories] = useState<ExerciseCategory[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<{ [key: string]: Exercise[] }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initializeCategories();
    }, []);

    const initializeCategories = () => {
        const exerciseCategories: ExerciseCategory[] = [
            {
                name: 'pernas',
                displayName: 'Pernas',
                exercises: [
                    { name: 'agachamentoLivre', displayName: 'Agachamento Livre', category: 'pernas', sets: '3x 12' },
                    { name: 'agachamentoHack', displayName: 'Agachamento Hack', category: 'pernas', sets: '3x 12' },
                    { name: 'legPress', displayName: 'Leg Press', category: 'pernas', sets: '3x 15' },
                    { name: 'cadeiraExtensora', displayName: 'Cadeira Extensora', category: 'pernas', sets: '3x 15' },
                    { name: 'cadeiraFlexora', displayName: 'Cadeira Flexora', category: 'pernas', sets: '3x 15' },
                    { name: 'stiff', displayName: 'Stiff', category: 'pernas', sets: '3x 12' },
                    { name: 'afundo', displayName: 'Afundo', category: 'pernas', sets: '3x 12' },
                    { name: 'levantamentoTerra', displayName: 'Levantamento Terra', category: 'pernas', sets: '3x 8' },
                    { name: 'panturrilhaEmPe', displayName: 'Panturrilha em Pé', category: 'pernas', sets: '4x 20' },
                    { name: 'panturrilhaSentado', displayName: 'Panturrilha Sentado', category: 'pernas', sets: '4x 20' },
                ]
            },
            {
                name: 'bracos',
                displayName: 'Braços',
                exercises: [
                    { name: 'roscaDireta', displayName: 'Rosca Direta', category: 'bracos', sets: '3x 12' },
                    { name: 'roscaAlternada', displayName: 'Rosca Alternada', category: 'bracos', sets: '3x 12' },
                    { name: 'roscaMartelo', displayName: 'Rosca Martelo', category: 'bracos', sets: '3x 12' },
                    { name: 'roscaConcentrada', displayName: 'Rosca Concentrada', category: 'bracos', sets: '3x 12' },
                    { name: 'roscaScott', displayName: 'Rosca Scott', category: 'bracos', sets: '3x 12' },
                    { name: 'roscaInversa', displayName: 'Rosca Inversa', category: 'bracos', sets: '3x 12' },
                    { name: 'tricepsTesta', displayName: 'Tríceps Testa', category: 'bracos', sets: '3x 12' },
                    { name: 'tricepsFrances', displayName: 'Tríceps Francês', category: 'bracos', sets: '3x 12' },
                    { name: 'tricepsCorda', displayName: 'Tríceps Corda', category: 'bracos', sets: '3x 12' },
                    { name: 'tricepsBanco', displayName: 'Tríceps Banco', category: 'bracos', sets: '3x 12' },
                    { name: 'mergulhoNasParalelas', displayName: 'Mergulho nas Paralelas', category: 'bracos', sets: '3x 10' },
                ]
            },
            {
                name: 'peito',
                displayName: 'Peito',
                exercises: [
                    { name: 'supinoReto', displayName: 'Supino Reto', category: 'peito', sets: '3x 10' },
                    { name: 'supinoInclinado', displayName: 'Supino Inclinado', category: 'peito', sets: '3x 10' },
                    { name: 'supinoDeclinado', displayName: 'Supino Declinado', category: 'peito', sets: '3x 10' },
                    { name: 'crucifixoReto', displayName: 'Crucifixo Reto', category: 'peito', sets: '3x 12' },
                    { name: 'crucifixoInclinado', displayName: 'Crucifixo Inclinado', category: 'peito', sets: '3x 12' },
                    { name: 'crucifixoDeclinado', displayName: 'Crucifixo Declinado', category: 'peito', sets: '3x 12' },
                    { name: 'peckDeck', displayName: 'Peck Deck', category: 'peito', sets: '3x 15' },
                    { name: 'pullover', displayName: 'Pullover', category: 'peito', sets: '3x 12' },
                    { name: 'flexaoDeBraco', displayName: 'Flexão de Braço', category: 'peito', sets: '3x 15' },
                ]
            },
            {
                name: 'costas',
                displayName: 'Costas',
                exercises: [
                    { name: 'puxadaAlta', displayName: 'Puxada Alta', category: 'costas', sets: '3x 12' },
                    { name: 'puxadaFrente', displayName: 'Puxada Frente', category: 'costas', sets: '3x 12' },
                    { name: 'puxadaAtras', displayName: 'Puxada Atrás', category: 'costas', sets: '3x 12' },
                    { name: 'barraFixa', displayName: 'Barra Fixa', category: 'costas', sets: '3x 8' },
                    { name: 'remadaCurvada', displayName: 'Remada Curvada', category: 'costas', sets: '3x 10' },
                    { name: 'remadaUnilateral', displayName: 'Remada Unilateral', category: 'costas', sets: '3x 12' },
                    { name: 'remadaBaixa', displayName: 'Remada Baixa', category: 'costas', sets: '3x 12' },
                    { name: 'remadaCavalinho', displayName: 'Remada Cavalinho', category: 'costas', sets: '3x 12' },
                    { name: 'levantamentoTerraCostas', displayName: 'Levantamento Terra (Costas)', category: 'costas', sets: '3x 8' },
                ]
            },
            {
                name: 'ombros',
                displayName: 'Ombros',
                exercises: [
                    { name: 'desenvolvimentoHalteres', displayName: 'Desenvolvimento Halteres', category: 'ombros', sets: '3x 12' },
                    { name: 'desenvolvimentoBarra', displayName: 'Desenvolvimento Barra', category: 'ombros', sets: '3x 10' },
                    { name: 'elevacaoLateral', displayName: 'Elevação Lateral', category: 'ombros', sets: '3x 15' },
                    { name: 'elevacaoFrontal', displayName: 'Elevação Frontal', category: 'ombros', sets: '3x 15' },
                    { name: 'elevacaoPosterior', displayName: 'Elevação Posterior', category: 'ombros', sets: '3x 15' },
                    { name: 'encolhimentoOmbros', displayName: 'Encolhimento Ombros', category: 'ombros', sets: '3x 15' },
                    { name: 'arnoldPress', displayName: 'Arnold Press', category: 'ombros', sets: '3x 12' },
                ]
            },
            {
                name: 'abdomen',
                displayName: 'Abdômen',
                exercises: [
                    { name: 'abdominalSupra', displayName: 'Abdominal Supra', category: 'abdomen', sets: '3x 20' },
                    { name: 'abdominalInfra', displayName: 'Abdominal Infra', category: 'abdomen', sets: '3x 20' },
                    { name: 'abdominalObliquo', displayName: 'Abdominal Oblíquo', category: 'abdomen', sets: '3x 20' },
                    { name: 'prancha', displayName: 'Prancha', category: 'abdomen', sets: '3x 60s' },
                    { name: 'elevacaoDePernas', displayName: 'Elevação de Pernas', category: 'abdomen', sets: '3x 15' },
                    { name: 'abWheel', displayName: 'Ab Wheel', category: 'abdomen', sets: '3x 12' },
                    { name: 'bicicletaNoAr', displayName: 'Bicicleta no Ar', category: 'abdomen', sets: '3x 20' },
                ]
            }
        ];

        setCategories(exerciseCategories);

    
        const initialSelected: { [key: string]: Exercise[] } = {};
        exerciseCategories.forEach(category => {
            initialSelected[category.name] = [];
        });
        setSelectedExercises(initialSelected);
    };

    const toggleExerciseSelection = (exercise: Exercise, categoryName: string) => {
        setSelectedExercises(prev => {
            const categoryExercises = prev[categoryName] || [];
            const isSelected = categoryExercises.some(ex => ex.name === exercise.name);

            if (isSelected) {
                return {
                    ...prev,
                    [categoryName]: categoryExercises.filter(ex => ex.name !== exercise.name)
                };
            } else {
                return {
                    ...prev,
                    [categoryName]: [...categoryExercises, exercise]
                };
            }
        });
    };

    const updateExerciseSets = (exerciseName: string, categoryName: string, newSets: string) => {
        setSelectedExercises(prev => {
            const categoryExercises = prev[categoryName] || [];
            const updatedExercises = categoryExercises.map(ex =>
                ex.name === exerciseName ? { ...ex, sets: newSets } : ex
            );

            return {
                ...prev,
                [categoryName]: updatedExercises
            };
        });
    };

    const moveExercise = (categoryName: string, fromIndex: number, toIndex: number) => {
        setSelectedExercises(prev => {
            const categoryExercises = [...(prev[categoryName] || [])];
            const [movedExercise] = categoryExercises.splice(fromIndex, 1);
            categoryExercises.splice(toIndex, 0, movedExercise);

            return {
                ...prev,
                [categoryName]: categoryExercises
            };
        });
    };

    const saveWorkoutConfiguration = async () => {
        try {
            setLoading(true);

            const weeklyPlan = {
                segunda: selectedExercises.pernas?.map(ex => ex.name) || [],
                terca: selectedExercises.bracos?.map(ex => ex.name) || [],
                quarta: selectedExercises.costas?.map(ex => ex.name) || [],
                quinta: selectedExercises.peito?.map(ex => ex.name) || [],
                sexta: selectedExercises.ombros?.map(ex => ex.name) || [],
                sabado: selectedExercises.abdomen?.map(ex => ex.name) || [],
                domingo: []
            };

            const exerciseData: any = {};
            Object.values(selectedExercises).flat().forEach(exercise => {
                exerciseData[exercise.name] = exercise.sets;
            });

            await exerciseService.createFile({
                ...weeklyPlan,
                ...exerciseData
            });

            Alert.alert('Sucesso', 'Padrão de treino criado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            Alert.alert('Erro', 'Não foi possível salvar a configuração do treino.');
        } finally {
            setLoading(false);
        }
    };

    const renderCategory = (category: ExerciseCategory) => {
        const selectedInCategory = selectedExercises[category.name] || [];

        return (
            <View key={category.name} className="mb-6">
                <Text className="text-white text-xl font-bold mb-4">{category.displayName}</Text>

                <View className="mb-4">
                    <Text className="text-white/70 text-sm mb-2">Exercícios Disponíveis:</Text>
                    <View className="flex-row flex-wrap">
                        {category.exercises.map(exercise => {
                            const isSelected = selectedInCategory.some(ex => ex.name === exercise.name);
                            return (
                                <TouchableOpacity
                                    key={exercise.name}
                                    className={`m-1 px-3 py-2 rounded-full ${isSelected ? 'bg-[#4abdd4]' : 'bg-gray-600'
                                        }`}
                                    onPress={() => toggleExerciseSelection(exercise, category.name)}
                                >
                                    <Text className="text-white text-sm">{exercise.displayName}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {selectedInCategory.length > 0 && (
                    <View>
                        <Text className="text-white/70 text-sm mb-2">Exercícios Selecionados:</Text>
                        {selectedInCategory.map((exercise, index) => (
                            <View key={exercise.name} className="bg-gray-700 p-3 mb-2 rounded-lg flex-row items-center">
                                <View className="flex-1">
                                    <Text className="text-white font-medium">{exercise.displayName}</Text>
                                    <View className="flex-row items-center mt-2">
                                        <Text className="text-white/70 text-sm mr-2">Séries x Reps:</Text>
                                        <TextInput
                                            className="bg-gray-600 text-white px-2 py-1 rounded text-sm flex-1"
                                            value={exercise.sets}
                                            onChangeText={(text) => updateExerciseSets(exercise.name, category.name, text)}
                                            placeholder="3x 12"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                <View className="flex-row ml-2">
                                    {index > 0 && (
                                        <TouchableOpacity
                                            className="p-2"
                                            onPress={() => moveExercise(category.name, index, index - 1)}
                                        >
                                            <Feather name="chevron-up" size={16} color="white" />
                                        </TouchableOpacity>
                                    )}
                                    {index < selectedInCategory.length - 1 && (
                                        <TouchableOpacity
                                            className="p-2"
                                            onPress={() => moveExercise(category.name, index, index + 1)}
                                        >
                                            <Feather name="chevron-down" size={16} color="white" />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        className="p-2"
                                        onPress={() => toggleExerciseSelection(exercise, category.name)}
                                    >
                                        <Feather name="x" size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const getTotalSelectedExercises = () => {
        return Object.values(selectedExercises).reduce((total, exercises) => total + exercises.length, 0);
    };

    return (
        <View className="flex-1 bg-[#1a1a1a]">

            <View className="flex-row items-center justify-between p-4 pt-12 bg-[#2a2a2a]">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Configurar Treino</Text>
                <View className="w-6" />
            </View>

            <ScrollView className="flex-1 p-4">
                <Text className="text-white/70 text-sm mb-6 text-center">
                    Selecione os exercícios para cada categoria e organize a sequência como desejar.
                    {getTotalSelectedExercises() > 0 && ` (${getTotalSelectedExercises()} exercícios selecionados)`}
                </Text>

                {categories.map(renderCategory)}

                <TouchableOpacity
                    className={`mt-6 mb-8 py-4 px-6 rounded-full flex-row items-center justify-center ${getTotalSelectedExercises() > 0 ? 'bg-[#4abdd4]' : 'bg-gray-600'
                        }`}
                    onPress={saveWorkoutConfiguration}
                    disabled={loading || getTotalSelectedExercises() === 0}
                >
                    {loading ? (
                        <Text className="text-white font-bold">Salvando...</Text>
                    ) : (
                        <>
                            <Feather name="save" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Salvar Configuração</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}