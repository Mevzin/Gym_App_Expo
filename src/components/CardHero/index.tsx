import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";


export default function CardHero() {

    return (
        <View className="w-full items-center">
            <View className="flex items-center my-6">
                <Text className="text-white text-4xl font-extrabold font-roboto">Sua jornada fitness</Text>
                <Text className="text-gray-400 font-bold font-roboto">Acompanhar o progresso, atingir metas!</Text>
            </View>
            <View className="flex-row w-[95%] justify-evenly">
                <View className="flex-row bg-secondary w-[45%] h-[80px] rounded-md items-center justify-evenly">
                    <View className="items-center">
                        <Text className="text-cyan-400 font-extrabold text-2xl font-roboto">12</Text>
                        <Text className="text-gray-400 font-bold font-roboto">Treinos</Text>
                    </View>
                    <View>
                        <MaterialCommunityIcons
                            name="weight-lifter"
                            size={40}
                            color={"#9d1e1d"}
                        />
                    </View>
                </View>
                <View className="flex-row bg-secondary w-[45%] h-[80px] rounded-md items-center justify-evenly">
                    <View className="items-center">
                        <Text className="text-cyan-400 font-extrabold text-2xl font-roboto">12.4</Text>
                        <Text className="text-gray-400 font-bold font-roboto">Horas</Text>
                    </View>
                    <View>
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={40}
                            color={"#9d1e1d"}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}