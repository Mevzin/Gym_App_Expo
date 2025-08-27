import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Button from "../ui/button";

export default function CardProfile() {

    return (
        <View className="flex-row mt-5 w-[90%] h-[60px] justify-between">
            <View className="flex-1 flex-row my-auto">
                <FontAwesome
                    name="user"
                    size={50}
                    color={"#FFF"}
                />

                <View className="flex-1 justify-center ml-3">
                    <Text className="text-sm text-gray-400 font-bold">Bem vindo</Text>
                    <Text className="text-xl text-gray-50 font-bold mt-[-5px]">Thiago Torres</Text>
                    <Text className="text-sm text-gray-400 font-bold mt-[-5px]">Terça-feira, 23 de setembro</Text>
                </View>
            </View>
            <View className="my-auto">
                <Button className="bg-secondary h-[45px] w-[45px]">
                    <FontAwesome
                        name="bell-o"
                        size={20}
                        color={"#FFF"}
                    />
                </Button>
            </View>
        </View>
    )
}