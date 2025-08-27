import { Text, View } from "react-native";
import * as Progress from 'react-native-progress';


export default function CardProgressTraining() {
    return (
        <View className="w-[95%] h-32 bg-[#c21409] my-6 px-5 rounded-xl justify-center">
            <View className="flex-row justify-between mb-5">
                <View>
                    <Text className="text-white font-extrabold text-2xl">Push Day</Text>
                    <Text className="text-white font-extralight ">5 exercises - 45 min</Text>
                </View>

                <View className="items-end">
                    <Text className="text-white font-extrabold text-3xl">3/5</Text>
                    <Text className="text-white font-extralight ">completed</Text>
                </View>
            </View>
            <Progress.Bar progress={0.6} width={340} animated={true} color="#4abdd4" borderColor="gray" borderWidth={0.2} height={10} />
        </View>
    )
}