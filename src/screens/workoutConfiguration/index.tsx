import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('pernas');
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

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

    const applyTemplate = (templateType: string) => {
        const templates = {
            'push-pull-legs': {
                pernas: ['agachamentoLivre', 'legPress', 'stiff', 'panturrilhaEmPe'],
                bracos: ['roscaDireta', 'tricepsTesta', 'roscaMartelo', 'tricepsCorda'],
                peito: ['supinoReto', 'crucifixoReto', 'flexaoDeBraco']
            },
            'upper-lower': {
                peito: ['supinoReto', 'crucifixoInclinado'],
                costas: ['puxadaAlta', 'remadaCurvada'],
                ombros: ['desenvolvimentoHalteres', 'elevacaoLateral'],
                bracos: ['roscaDireta', 'tricepsTesta'],
                pernas: ['agachamentoLivre', 'legPress', 'stiff']
            },
            'full-body': 'all'
        };

        const template = templates[templateType as keyof typeof templates];
        if (template) {
            const newSelected: { [key: string]: Exercise[] } = {};

            if (templateType === 'full-body') {
                categories.forEach(category => {
                    newSelected[category.name] = [...category.exercises];
                });
            } else {
                categories.forEach(category => {
                    const templateExercises = template[category.name as keyof typeof template] || [];
                    newSelected[category.name] = category.exercises.filter(ex =>
                        (templateExercises as string[]).includes(ex.name)
                    );
                });
            }

            setSelectedExercises(newSelected);
        }
    };

    const filteredExercises = categories.find(cat => cat.name === activeCategory)?.exercises.filter(exercise =>
        exercise.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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



    const getTotalSelectedExercises = () => {
        return Object.values(selectedExercises).reduce((total, exercises) => total + exercises.length, 0);
    };

    return (
        <View className="flex-1 bg-primary">
            <View className="flex-row items-center justify-between p-4 pt-5 bg-primary">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Configurar Treino</Text>
                <TouchableOpacity
                    className="bg-red-600 px-4 py-2 rounded-lg"
                    onPress={saveWorkoutConfiguration}
                    disabled={loading || getTotalSelectedExercises() === 0}
                >
                    <Text className="text-white font-bold text-sm">
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                <View className="p-4">
                    <View className="bg-gray-700 rounded-lg flex-row items-center px-4 py-3">
                        <Feather name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 text-white ml-3"
                            placeholder="Buscar exercícios..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                <View className="px-4 mb-4">
                    <Text className="text-white text-lg font-bold mb-3">Templates Rápidos</Text>
                    <View className="flex-row space-x-2 gap-2">
                        <TouchableOpacity
                            className="bg-red-600 px-4 py-2 rounded-lg"
                            onPress={() => applyTemplate('push-pull-legs')}
                        >
                            <Text className="text-white font-medium text-sm">Push/Pull/Legs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-red-600 px-4 py-2 rounded-lg"
                            onPress={() => applyTemplate('upper-lower')}
                        >
                            <Text className="text-white font-medium text-sm">Upper/Lower</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-red-600 px-4 py-2 rounded-lg"
                            onPress={() => applyTemplate('full-body')}
                        >
                            <Text className="text-white font-medium text-sm">Full Body</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-4 mb-4">
                    <Text className="text-white text-lg font-bold mb-3">Categorias</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row space-x-2 gap-2">
                            {categories.map(category => (
                                <TouchableOpacity
                                    key={category.name}
                                    className={`px-4 py-2 rounded-lg ${activeCategory === category.name ? 'bg-red-600' : 'bg-gray-600'
                                        }`}
                                    onPress={() => setActiveCategory(category.name)}
                                >
                                    <Text className="text-white font-medium text-sm">
                                        {category.displayName}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View className="px-4 mb-4">
                    <Text className="text-white text-lg font-bold mb-3">Exercícios Disponíveis</Text>
                    <View className="flex-row flex-wrap">
                        {filteredExercises.map(exercise => {
                            const isSelected = (selectedExercises[activeCategory] || []).some(ex => ex.name === exercise.name);
                            return (
                                <TouchableOpacity
                                    key={exercise.name}
                                    className={`m-1 px-3 py-2 rounded-lg ${isSelected ? 'bg-red-600' : 'bg-gray-600'
                                        }`}
                                    onPress={() => toggleExerciseSelection(exercise, activeCategory)}
                                >
                                    <Text className="text-white text-sm">{exercise.displayName}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {(selectedExercises[activeCategory] || []).length > 0 && (
                    <View className="px-4 mb-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-white text-lg font-bold">Exercícios Selecionados</Text>
                            <Text className="text-[#4abdd4] text-sm">
                                {(selectedExercises[activeCategory] || []).length} exercícios
                            </Text>
                        </View>
                        {(selectedExercises[activeCategory] || []).map((exercise, index) => (
                            <View key={exercise.name} className="bg-gray-700 p-3 mb-2 rounded-lg flex-row items-center">
                                <MaterialIcons name="drag-handle" size={20} color="#9CA3AF" />
                                <View className="flex-1 ml-3">
                                    <Text className="text-white font-medium">{exercise.displayName}</Text>
                                    <View className="flex-row items-center mt-2">
                                        <Text className="text-white/70 text-sm mr-2">Séries x Reps:</Text>
                                        <TextInput
                                            className="bg-gray-600 text-white px-2 py-1 rounded text-sm flex-1"
                                            value={exercise.sets}
                                            onChangeText={(text) => updateExerciseSets(exercise.name, activeCategory, text)}
                                            placeholder="3x 12"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity
                                    className="p-2"
                                    onPress={() => toggleExerciseSelection(exercise, activeCategory)}
                                >
                                    <Feather name="x" size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <View className="px-4 mb-8">
                    <Text className="text-white text-lg font-bold mb-3">Preview Semanal</Text>
                    <View className="space-y-2 gap-2">
                        {[
                            { day: 'Segunda-feira', category: 'pernas', displayName: 'Pernas' },
                            { day: 'Terça-feira', category: 'bracos', displayName: 'Braços' },
                            { day: 'Quarta-feira', category: 'costas', displayName: 'Costas' },
                            { day: 'Quinta-feira', category: 'peito', displayName: 'Peito' },
                            { day: 'Sexta-feira', category: 'ombros', displayName: 'Ombros' },
                            { day: 'Sábado', category: 'abdomen', displayName: 'Abdômen' },
                        ].map(({ day, category, displayName }) => {
                            const dayExercises = selectedExercises[category] || [];
                            return (
                                <View key={day} className="bg-gray-700 p-3 rounded-lg flex-row items-center justify-between">
                                    <Text className="text-white font-medium">{day}</Text>
                                    <Text className="text-[#4abdd4] text-sm">
                                        {dayExercises.length > 0 ? `${displayName} - ${dayExercises.length} exercícios` : 'Não configurado'}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}