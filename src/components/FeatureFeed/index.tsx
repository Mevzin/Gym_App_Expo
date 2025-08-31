import { Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

export default function FeatureFeed() {
    const navigation = useNavigation();

    const handleProgressTracking = () => {
        navigation.navigate('Progresso' as never);
    };

    const handlePersonalTraining = () => {
        navigation.navigate('Profile' as never);
    };

    const handleClassScheduling = () => {
        navigation.navigate('Treinos' as never);
    };

    const handleAchievementSystem = () => {
        navigation.navigate('Progresso' as never);
    };

    return (
        <View className="w-[95%]">
            <Text className="text-white text-2xl font-extrabold font-roboto">
                Features
            </Text>
            <View className="flex items-center">
                <TouchableOpacity 
                    className="flex-row bg-secondary w-[95%] h-28 my-3 justify-start rounded-lg items-center px-4"
                    onPress={handleProgressTracking}
                    activeOpacity={0.8}
                >
                    <View className="w-[50px] h-[50px] rounded-md items-center justify-center mr-4 bg-[#ff1500]/30">
                        <MaterialIcons
                            name="trending-up"
                            size={30}
                            color="#ff1500"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-extrabold tracking-tighter text-lg font-roboto">Progress tracking</Text>
                        <Text className="text-gray-500 font-extrabold tracking-tighter text-base font-roboto">Monitor your fitness journey with detailed analytics</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="flex-row bg-secondary w-[95%] h-28 my-3 justify-start rounded-lg items-center px-4"
                    onPress={handlePersonalTraining}
                    activeOpacity={0.8}
                >
                    <View className="w-[50px] h-[50px] rounded-md items-center justify-center mr-4 bg-[#14b0c7]/30">
                        <MaterialCommunityIcons
                            name="account-supervisor"
                            size={30}
                            color="#14b0c7"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-extrabold tracking-tighter text-lg font-roboto">Personal Training</Text>
                        <Text className="text-gray-500 font-extrabold tracking-tighter text-base font-roboto">Get personalized workouts from certified trainers</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="flex-row bg-secondary w-[95%] h-28 my-3 justify-start rounded-lg items-center px-4"
                    onPress={handleClassScheduling}
                    activeOpacity={0.8}
                >
                    <View className="w-[50px] h-[50px] rounded-md items-center justify-center mr-4 bg-[#ff1500]/30">
                        <MaterialIcons
                            name="schedule"
                            size={30}
                            color="#ff1500"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-extrabold tracking-tighter text-lg font-roboto">Class Scheduling</Text>
                        <Text className="text-gray-500 font-extrabold tracking-tighter text-base font-roboto">Book your favorite classes with ease</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="flex-row bg-secondary w-[95%] h-28 my-3 justify-start rounded-lg items-center px-4"
                    onPress={handleAchievementSystem}
                    activeOpacity={0.8}
                >
                    <View className="w-[50px] h-[50px] rounded-md items-center justify-center mr-4 bg-[#14b0c7]/30">
                        <MaterialIcons
                            name="emoji-events"
                            size={30}
                            color="#14b0c7"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-extrabold tracking-tighter text-lg font-roboto">Achievement System</Text>
                        <Text className="text-gray-500 font-extrabold tracking-tighter text-base font-roboto">Unlock badges and celebrate milestones</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}