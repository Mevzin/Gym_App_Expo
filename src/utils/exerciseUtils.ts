import exerciseData from '../services/data.json';

export const getExerciseName = (exerciseId: string): string => {
    const exerciseMap: { [key: string]: string } = {};
    
    exerciseData.Pernas.forEach(exercise => {
        exerciseMap[exercise.value] = exercise.label;
    });
    
    exerciseData.Braços.Bíceps.forEach(exercise => {
        exerciseMap[exercise.value] = exercise.label;
    });
    
    exerciseData.Braços.Tríceps.forEach(exercise => {
        exerciseMap[exercise.value] = exercise.label;
    });
    
    exerciseData.Peito.forEach(exercise => {
        exerciseMap[exercise.value] = exercise.label;
    });
    
    exerciseData.Costas.forEach(exercise => {
        exerciseMap[exercise.value] = exercise.label;
    });
    
    exerciseData.Ombros.forEach(exercise => {
        exerciseMap[exercise.value] = exercise.label;
    });
    
    exerciseData.Abdomen.forEach(exercise => {
        exerciseMap[exercise.value] = exercise.label;
    });
    
    return exerciseMap[exerciseId] || exerciseId;
};


export const getAllExercises = () => {
    return exerciseData;
};


export const getExercisesByCategory = (category: string) => {
    switch (category.toLowerCase()) {
        case 'pernas':
            return exerciseData.Pernas;
        case 'bracos':
        case 'braços':
            return {
                biceps: exerciseData.Braços.Bíceps,
                triceps: exerciseData.Braços.Tríceps
            };
        case 'peito':
            return exerciseData.Peito;
        case 'costas':
            return exerciseData.Costas;
        case 'ombros':
            return exerciseData.Ombros;
        case 'abdomen':
        case 'abdômen':
            return exerciseData.Abdomen;
        default:
            return [];
    }
};