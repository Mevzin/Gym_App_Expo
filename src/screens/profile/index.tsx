import { SafeAreaView, ScrollView, Text, View, Image } from "react-native";
import CardProfile from "../../components/CardProfile";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from 'react-native';
import Button from "../../components/ui/button";

export default function Profile() {
    const { width } = useWindowDimensions();

    return (
        <SafeAreaView className="flex-1 bg-dark ">
            <ScrollView
                className="bg-primary"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center">
                    <View className="w-[95%] mt-5 items-center">
                        <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center mb-2">
                            <FontAwesome
                                name="user"
                                size={50}
                                color={"#FFF"}
                            />
                        </View>
                        <Text className="text-white font-bold text-2xl">Marcus Johnson</Text>
                        <Text className="text-gray-400 font-bold">Premium Member</Text>

                        <View className="flex-row w-full justify-evenly mt-5">
                            <View className="items-center">
                                <Text className="text-cyan-400 font-extrabold text-2xl">156</Text>
                                <Text className="text-gray-400 font-bold">Workouts</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-cyan-400 font-extrabold text-2xl">84</Text>
                                <Text className="text-gray-400 font-bold">Days Streak</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-cyan-400 font-extrabold text-2xl">12</Text>
                                <Text className="text-gray-400 font-bold">Achievements</Text>
                            </View>
                        </View>

                        <View className="w-full mt-8">
                            <Text className="text-white font-bold text-xl mb-3">Personal Information</Text>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Full Name</Text>
                                        <Text className="text-white font-bold text-lg">Marcus Johnson</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Email</Text>
                                        <Text className="text-white font-bold text-lg">marcus.j@email.com</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                            <Button className="w-full h-23 items-center bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row w-full justify-between items-center">
                                    <View>
                                        <Text className="text-gray-400 font-bold">Phone</Text>
                                        <Text className="text-white font-bold text-lg">+1 (555) 123-4567</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </Button>
                        </View>

                        <View className="w-full mt-5">
                            <Text className="text-white font-bold text-xl mb-3">Fitness Metrics</Text>
                            <View className="flex-row justify-between">
                                <View className="w-[48%] bg-secondary rounded-lg p-4">
                                    <Text className="text-gray-400 font-bold">Weight</Text>
                                    <Text className="text-white font-bold text-xl">185 lbs</Text>
                                    <Text className="text-green-500 font-bold">-2 lbs this month</Text>
                                </View>
                                <View className="w-[48%] bg-secondary rounded-lg p-4">
                                    <Text className="text-gray-400 font-bold">Height</Text>
                                    <Text className="text-white font-bold text-xl">6'2"</Text>
                                    <Text className="text-gray-400 font-bold">BMI: 23.8</Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between mt-3">
                                <View className="w-[48%] bg-secondary rounded-lg p-4">
                                    <Text className="text-gray-400 font-bold">Body Fat</Text>
                                    <Text className="text-white font-bold text-xl">12%</Text>
                                    <Text className="text-green-500 font-bold">-2% this month</Text>
                                </View>
                                <View className="w-[48%] bg-secondary rounded-lg p-4">
                                    <Text className="text-gray-400 font-bold">Muscle Mass</Text>
                                    <Text className="text-white font-bold text-xl">162 lbs</Text>
                                    <Text className="text-green-500 font-bold">+3 lbs this month</Text>
                                </View>
                            </View>
                        </View>

                        <View className="w-full mt-5">
                            <Text className="text-white font-bold text-xl mb-3">Membership</Text>
                            <View className="w-full bg-[#c21409] rounded-lg p-4 mb-3">
                                <Text className="text-white font-bold text-xl">Premium Plan</Text>
                                <View className="flex-row justify-between items-center mt-2">
                                    <Text className="text-white">Expires: March 15, 2025</Text>
                                    <Button className="bg-secondary px-3 py-1">
                                        <Text className="text-white font-bold">Manage</Text>
                                    </Button>
                                </View>
                                <Text className="text-white mt-2">Auto-renewal: ON</Text>
                            </View>
                        </View>

                        <View className="w-full mt-5 mb-8">
                            <Text className="text-white font-bold text-xl mb-3">Preferences</Text>
                            <View className="w-full bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="notifications" size={24} color="#4abdd4" />
                                        <Text className="text-white font-bold text-lg ml-2">Notifications</Text>
                                    </View>
                                    <View className="w-12 h-6 bg-[#4abdd4] rounded-full items-end p-1">
                                        <View className="w-4 h-4 bg-white rounded-full" />
                                    </View>
                                </View>
                            </View>
                            <View className="w-full bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="nightlight-round" size={24} color="#4abdd4" />
                                        <Text className="text-white font-bold text-lg ml-2">Dark Mode</Text>
                                    </View>
                                    <View className="w-12 h-6 bg-[#4abdd4] rounded-full items-end p-1">
                                        <View className="w-4 h-4 bg-white rounded-full" />
                                    </View>
                                </View>
                            </View>
                            <View className="w-full bg-secondary rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="privacy-tip" size={24} color="#4abdd4" />
                                        <Text className="text-white font-bold text-lg ml-2">Privacy Settings</Text>
                                    </View>
                                    <FontAwesome name="angle-right" size={24} color="#FFF" />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}