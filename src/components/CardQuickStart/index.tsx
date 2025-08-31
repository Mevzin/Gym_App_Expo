import { Text, View, TouchableOpacity } from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

export default function CardQuickStart() {
    const navigation = useNavigation();

    const handleStartWorkout = () => {
        navigation.navigate('Treinos' as never);
    };

    const handleViewProgress = () => {
        navigation.navigate('Progresso' as never);
    };

    return (
        <View className="my-6 w-[95%]">
            <Text className="text-white text-2xl font-semibold font-roboto">Quick Start</Text>
            <View className="flex-row justify-evenly">
                <TouchableOpacity 
                    className="flex-col w-[45%] h-28 bg-[#c21409] mt-3 rounded-lg items-center justify-center"
                    onPress={handleStartWorkout}
                    activeOpacity={0.8}
                >
                    <AntDesign
                        name="caretright"
                        size={30}
                        color={"#FFF"}
                    />
                    <Text className="text-white font-extrabold font-roboto mt-2">
                        Start Workout
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="flex-col w-[45%] h-28 bg-[#4abdd4] mt-3 rounded-lg items-center justify-center"
                    onPress={handleViewProgress}
                    activeOpacity={0.8}
                >
                    <Octicons
                        name="graph"
                        size={30}
                        color={"#FFF"}
                    />
                    <Text className="text-white font-extrabold font-roboto mt-2">
                        View Progress
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}