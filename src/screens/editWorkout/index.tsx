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

export function EditWorkout() {
    const navigation = useNavigation();
    const [categories, setCategories] = useState<ExerciseCategory[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<{ [key: string]: Exercise[] }>({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('pernas');
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    useEffect(() => {
        initializeCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            loadCurrentWorkout();
        }
    }, [categories]);

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
                    { name: 'tricepsCorda', displayName: 'Tríceps Corda', category: 'bracos', sets: '3x 15' },
                    { name: 'tricepsBanco', displayName: 'Tríceps Banco', category: 'bracos', sets: '3x 12' },
                    { name: 'mergulhoNasParalelas', displayName: 'Mergulho nas Paralelas', category: 'bracos', sets: '3x 12' },
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
                    { name: 'barraFixa', displayName: 'Barra Fixa', category: 'costas', sets: '3x 10' },
                    { name: 'remadaCurvada', displayName: 'Remada Curvada', category: 'costas', sets: '3x 12' },
                    { name: 'remadaUnilateral', displayName: 'Remada Unilateral', category: 'costas', sets: '3x 12' },
                    { name: 'remadaBaixa', displayName: 'Remada Baixa', category: 'costas', sets: '3x 12' },
                    { name: 'remadaCavalinho', displayName: 'Remada Cavalinho', category: 'costas', sets: '3x 12' },
                    { name: 'levantamentoTerraCostas', displayName: 'Levantamento Terra', category: 'costas', sets: '3x 8' },
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
    };

    const loadCurrentWorkout = async () => {
        try {
            setInitialLoading(true);
            const userFile = await exerciseService.checkUserFile();

            if (userFile) {
                const workoutData = userFile;

                const currentSelected: { [key: string]: Exercise[] } = {
                    pernas: [],
                    bracos: [],
                    peito: [],
                    costas: [],
                    ombros: [],
                    abdomen: []
                };

                const dayToCategory = {
                    segunda: 'pernas',
                    terca: 'bracos',
                    quarta: 'costas',
                    quinta: 'peito',
                    sexta: 'ombros',
                    sabado: 'abdomen'
                };

                Object.entries(dayToCategory).forEach(([day, category]) => {
                    const dayExercises = workoutData[day] || [];

                    dayExercises.forEach((exerciseName: string) => {
                        const foundExercise = categories.find(cat => cat.name === category)
                            ?.exercises.find(ex => ex.name === exerciseName);

                        if (foundExercise) {
                            const sets = workoutData[exerciseName] || foundExercise.sets;
                            currentSelected[category].push({
                                ...foundExercise,
                                sets
                            });
                        }
                    });
                });

                setSelectedExercises(currentSelected);
            } else {
                const initialSelected: { [key: string]: Exercise[] } = {};
                categories.forEach(category => {
                    initialSelected[category.name] = [];
                });
                setSelectedExercises(initialSelected);
            }
        } catch (error) {
            console.error('Erro ao carregar treino atual:', error);
            Alert.alert('Erro', 'Não foi possível carregar o treino atual.');
        } finally {
            setInitialLoading(false);
        }
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
            const updatedExercises = categoryExercises.map(exercise =>
                exercise.name === exerciseName ? { ...exercise, sets: newSets } : exercise
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
                pernas: ['agachamentoLivre', 'legPress', 'cadeiraExtensora', 'stiff'],
                peito: ['supinoReto', 'supinoInclinado', 'crucifixoReto'],
                ombros: ['desenvolvimentoHalteres', 'elevacaoLateral'],
                bracos: ['roscaDireta', 'tricepsTesta'],
                costas: ['puxadaAlta', 'remadaCurvada', 'barraFixa'],
                abdomen: ['abdominalSupra', 'prancha']
            },
            'upper-lower': {
                peito: ['supinoReto', 'crucifixoReto'],
                costas: ['puxadaAlta', 'remadaCurvada'],
                ombros: ['desenvolvimentoHalteres', 'elevacaoLateral'],
                bracos: ['roscaDireta', 'tricepsTesta'],
                pernas: ['agachamentoLivre', 'legPress', 'stiff', 'cadeiraExtensora'],
                abdomen: ['abdominalSupra', 'prancha']
            },
            'full-body': {
                pernas: ['agachamentoLivre', 'legPress'],
                peito: ['supinoReto'],
                costas: ['puxadaAlta'],
                ombros: ['desenvolvimentoHalteres'],
                bracos: ['roscaDireta'],
                abdomen: ['abdominalSupra']
            }
        };

        const template = templates[templateType as keyof typeof templates];
        if (template) {
            const newSelected: { [key: string]: Exercise[] } = {};

            Object.entries(template).forEach(([categoryName, exerciseNames]) => {
                const category = categories.find(cat => cat.name === categoryName);
                if (category) {
                    newSelected[categoryName] = exerciseNames.map(exerciseName => {
                        const exercise = category.exercises.find(ex => ex.name === exerciseName);
                        return exercise || { name: exerciseName, displayName: exerciseName, category: categoryName, sets: '3x 12' };
                    }).filter(Boolean);
                }
            });

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

            await exerciseService.updateFile({
                ...weeklyPlan,
                ...exerciseData
            });

            Alert.alert('Sucesso', 'Treino atualizado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            Alert.alert('Erro', 'Não foi possível salvar as alterações do treino.');
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

    if (initialLoading) {
        return (
            <View className="flex-1 bg-[#1a1a1a] justify-center items-center">
                <Text className="text-white text-lg">Carregando treino atual...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <View className="flex-row items-center justify-between p-4 pt-5 bg-primary">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Editar Treino</Text>
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
                    <View className="flex-row space-x-3 justify-between">
                        <TouchableOpacity
                            className="bg-red-600 px-4 py-2 rounded-lg"
                            onPress={() => applyTemplate('push-pull-legs')}
                        >
                            <Text className="text-white font-bold text-sm">Push/Pull/Legs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-gray-600 px-4 py-2 rounded-lg"
                            onPress={() => applyTemplate('upper-lower')}
                        >
                            <Text className="text-white font-bold text-sm">Upper/Lower</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-gray-600 px-4 py-2 rounded-lg"
                            onPress={() => applyTemplate('full-body')}
                        >
                            <Text className="text-white font-bold text-sm">Full Body</Text>
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
                            { day: 'Sábado', category: 'abdomen', displayName: 'Abdômen' }
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