import { SafeAreaView, ScrollView, Text, View } from "react-native";
import CardProfile from "../../components/CardProfile";
import { MaterialIcons } from "@expo/vector-icons";
import * as ProgressBar from 'react-native-progress';
import { useWindowDimensions } from 'react-native';


export default function Progress() {
    const { width } = useWindowDimensions()

    return (
        <SafeAreaView className="flex-1 bg-dark ">
            <ScrollView
                className="bg-primary"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center">
                    <CardProfile />
                    <View className="w-[95%] mt-2">
                        <Text className="text-white font-bold text-2xl ">Your Progress Overview</Text>
                        <View className="flex-row justify-between mt-4">
                            <View className="bg-secondary w-[48%] h-36 rounded-lg justify-center">
                                <View className="flex-row justify-between mx-5 items-center">
                                    <MaterialIcons
                                        name="search"
                                        size={30}
                                        color={"cyan"}
                                    />
                                    <Text className="text-green-500 font-bold text-xl">-5.2kg</Text>
                                </View>
                                <View className="mx-5">
                                    <Text className="text-gray-400 font-light mt-5">Weight Loss</Text>
                                    <Text className="text-white font-bold text-2xl">12.8 kg</Text>
                                </View>
                            </View>
                            <View className="bg-secondary w-[48%] h-36 rounded-lg justify-center">
                                <View className="flex-row justify-between mx-5 items-center">
                                    <MaterialIcons
                                        name="search"
                                        size={30}
                                        color={"red"}
                                    />
                                    <Text className="text-green-500 font-bold text-xl">-5.2kg</Text>
                                </View>
                                <View className="mx-5">
                                    <Text className="text-gray-400 font-light mt-5">Weight Loss</Text>
                                    <Text className="text-white font-bold text-2xl">12.8 kg</Text>
                                </View>
                            </View>
                        </View>
                        <View className="w-full h-36 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <Text className="text-white font-bold text-xl">This Week</Text>
                                <MaterialIcons
                                    name="search"
                                    size={30}
                                    color={"#4abdd4"}
                                />
                            </View>
                            <View className="mt-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-400 font-bold text-xl mb-3">Workouts Completed</Text>
                                    <Text className="text-white font-bold text-xl mb-3"> 4/5</Text>
                                </View>
                                <ProgressBar.Bar
                                    progress={0.6}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4abdd4"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                    </View>
                    <View className="w-[95%] mt-2">
                        <Text className="text-white font-bold text-2xl mt-5">Performance Metrics</Text>
                        <View className="w-full h-28 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="search"
                                        size={30}
                                        color={"#4abdd4"}
                                    />
                                    <Text className="text-white font-bold text-xl  ml-2">This Week</Text>
                                </View>

                                <Text className="text-green-500 font-bold text-xl">+12%</Text>
                            </View>
                            <View className="mt-3">
                                <ProgressBar.Bar
                                    progress={0.6}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4abdd4"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                        <View className="w-full h-28 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="search"
                                        size={30}
                                        color={"#b7190f"}
                                    />
                                    <Text className="text-white font-bold text-xl  ml-2">This Week</Text>
                                </View>
                                <Text className="text-green-500 font-bold text-xl">+12%</Text>
                            </View>
                            <View className="mt-3">
                                <ProgressBar.Bar
                                    progress={0.6}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#b7190f"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                        <View className="w-full h-28 mt-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="search"
                                        size={30}
                                        color={"#4cdc80"}
                                    />
                                    <Text className="text-white font-bold text-xl  ml-2">This Week</Text>
                                </View>

                                <Text className="text-green-500 font-bold text-xl">+12%</Text>
                            </View>
                            <View className="mt-3">
                                <ProgressBar.Bar
                                    progress={0.6}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4cdc80"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                    </View>
                    <View className="w-[95%] mt-2">
                        <Text className="text-white font-bold text-2xl mt-5">Monthly Goals</Text>
                        <View className="w-full h-32 my-5 rounded-lg bg-secondary px-5 justify-center">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-400 font-bold text-lg">Lose 3kg</Text>
                                </View>
                                <Text className="text-white font-bold text-lg">2.1/3.0 kg</Text>
                            </View>
                            <View className="mt-1 mb-2">
                                <ProgressBar.Bar
                                    progress={0.6}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#4abdd4"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-400 font-bold text-lg">20 Workouts</Text>
                                </View>

                                <Text className="text-white font-bold text-lg">14/20</Text>
                            </View>
                            <View className="mt-1">
                                <ProgressBar.Bar
                                    progress={0.6}
                                    width={width / 1.16}
                                    animated={true}
                                    color="#b41b12"
                                    borderColor="gray"
                                    borderWidth={0.2}
                                    height={10}
                                    unfilledColor="#384152"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}