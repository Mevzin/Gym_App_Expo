import { SafeAreaView, ScrollView, View } from "react-native";
import CardProfile from "../../components/CardProfile";
import CardProgressTraining from "../../components/CardProgressTraining";
import ExercisesList from "../../components/ExercisesList";
import { CompletedExercisesProvider } from "../../contexts/CompletedExercisesContext";


export default function Sessions() {
    return (
        <CompletedExercisesProvider>
            <SafeAreaView className="flex-1 bg-dark ">
                <ScrollView
                    className="bg-primary"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="items-center">
                        <CardProfile />
                        <CardProgressTraining />
                        <ExercisesList />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </CompletedExercisesProvider>
    )
}