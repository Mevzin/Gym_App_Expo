import { Text, View } from "react-native";
import Button from "../ui/button";
import { MaterialIcons } from "@expo/vector-icons";

interface ILargeButtonProps {
    icon: any,
    color: string,
    title: string,
    description: string
}

export default function LargeButton({ color, description, title, icon }: ILargeButtonProps) {

    if (color == "#ff1500") {
        return (
            <Button className="flex-row bg-secondary w-[95%] h-28 my-3 justify-start">
                <View className={`w-[50px] h-[50px] rounded-md items-center justify-center mr-2 bg-[#ff1500]/30`}>
                    <MaterialIcons
                        name={icon}
                        size={40}
                        color={color}
                    />
                </View>
                <View>
                    <Text className="text-white font-extrabold tracking-tighter text-lg">{title}</Text>
                    <Text className="text-gray-500 font-extrabold tracking-tighter text-base w-[80%]">{description}</Text>
                </View>
            </Button>
        )
    } else {
        return (
            <Button className="flex-row bg-secondary w-[95%] h-28 my-3 justify-start">
                <View className={`w-[50px] h-[50px] rounded-md items-center justify-center mr-2 bg-[#14b0c7]/30`}>
                    <MaterialIcons
                        name={icon}
                        size={40}
                        color={color}
                    />
                </View>
                <View>
                    <Text className="text-white font-extrabold tracking-tighter text-lg">{title}</Text>
                    <Text className="text-gray-500 font-extrabold tracking-tighter text-base w-[80%]">{description}</Text>
                </View>
            </Button>
        )
    }

}