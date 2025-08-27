import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Button from "../ui/button";
import { useState } from "react";

interface ICardExerciseLargeProps {
    isFinished: boolean
}

export default function CardExerciseLarge() {

    const [isFinished, setIsFinished] = useState(false)

    function handleFinished() {
        setIsFinished(!isFinished)
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
                        <Text className="text-white/30 font-bold text-2xl">Bench Press</Text>
                        <Text className="text-white/30 font-extralight">4 sets x 8-10 reps</Text>
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
                        <Text className="text-white font-bold text-2xl">Bench Press</Text>
                        <Text className="text-white font-extralight">4 sets x 8-10 reps</Text>
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