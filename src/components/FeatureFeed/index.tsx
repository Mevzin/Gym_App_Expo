import { Text, View } from "react-native";
import LargeButton from "../LargerButton";

export default function FeatureFeed() {
    return (
        <View className="w-[95%]">
            <Text className="text-white text-2xl font-extrabold">
                Features
            </Text>
            <View className="flex items-center">
                <LargeButton color="#ff1500" title="Progress Tracking" description="Monitor your fitness journey with detailed analytics" icon="search" />
                <LargeButton color="#ff1500" title="Progress Tracking" description="Monitor your fitness journey with detailed analytics" icon="search" />
                <LargeButton color="#ff1500" title="Progress Tracking" description="Monitor your fitness journey with detailed analytics" icon="search" />
                <LargeButton color="#ff1500" title="Progress Tracking" description="Monitor your fitness journey with detailed analytics" icon="search" />
            </View>
        </View>
    )
}