import { Text, View } from "react-native";
import CardExerciseLarge from "../CardExerciseLarge";


export default function ExercisesList() {

    return (
        <View className="w-[95%]">
            <Text className="text-white text-2xl font-extrabold">Exercise ChackList</Text>
            <CardExerciseLarge />
            <CardExerciseLarge />
            <CardExerciseLarge />
            <CardExerciseLarge />
            <CardExerciseLarge />
        </View>
    )
}