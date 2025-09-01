import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Button from "../ui/button";
import { useEffect } from "react";
import { exerciseService } from "../../services/api";
import { getExerciseName } from "../../utils/exerciseUtils";
import { useCompletedExercises } from "../../contexts/CompletedExercisesContext";
import { logger } from "../../utils/logger";

interface ICardExerciseLargeProps {
    name: string;
    value: string;
    isFinished?: boolean;
}

export default function CardExerciseLarge({ name, value, isFinished: initialIsFinished = false }: ICardExerciseLargeProps) {
    const { isExerciseCompleted, markExerciseAsCompleted, unmarkExerciseAsCompleted, refreshCompletedExercises } = useCompletedExercises();
    
    const isFinished = isExerciseCompleted(name);

    useEffect(() => {
        refreshCompletedExercises();
    }, [name, refreshCompletedExercises]);

    async function handleFinished() {
        try {
            if (isFinished) {
                await unmarkExerciseAsCompleted(name);
            } else {
                await markExerciseAsCompleted(name);
            }
        } catch (error) {
            logger.error('Erro ao atualizar status do exercício:', error);
        }
    }

    if (isFinished == false) {
        return (
            <Button className="w-[100%] h-24 bg-secondary/30 rounded-lg my-3 px-5 items-center justify-between flex-row" onPress={() => handleFinished()}>
                <View className="flex-row justify-center items-center">
                    <View className="mr-3">
                        <AntDesign
                            name="checkcircleo"
                            size={25}
                            color={"#697f84"}
                        />
                    </View>
                    <View>
                        <Text className="text-white/30 font-bold text-2xl font-roboto">{getExerciseName(name)}</Text>
                        <Text className="text-white/30 font-extralight font-roboto">{value?.trim() || value}</Text>
                    </View>
                </View>
                <View>
                    <MaterialCommunityIcons
                        name="weight-lifter"
                        size={20}
                        color={"697f84"}
                    />
                </View>
            </Button>
        )
    } else {
        return (
            <Button className="w-[100%] h-24 bg-secondary rounded-lg my-3 px-5 items-center justify-between flex-row" onPress={() => handleFinished()}>
                <View className="flex-row justify-center items-center">
                    <View className="mr-3">
                        <AntDesign
                            name="checkcircle"
                            size={25}
                            color={"#4abdd4"}
                        />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-2xl font-roboto">{getExerciseName(name)}</Text>
                        <Text className="text-white font-extralight font-roboto">{value?.trim() || value}</Text>
                    </View>
                </View>
                <View>
                    <MaterialCommunityIcons
                        name="weight-lifter"
                        size={20}
                        color={"white"}
                    />
                </View>
            </Button>
        )
    }

}