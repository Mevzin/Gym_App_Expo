import { SafeAreaView, ScrollView, Text, View } from "react-native";
import CardProfile from "../../components/CardProfile";
import CardProgressTraining from "../../components/CardProgressTraining";
import ExercisesList from "../../components/ExercisesList";


export default function Sessions() {
    return (
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
    )
}