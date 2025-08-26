import { Text, View } from "react-native";
import Button from "../ui/button";
import { AntDesign, Octicons } from "@expo/vector-icons";

export default function CardQuickStart() {
    return (
        <View className="my-6 w-[95%]">
            <Text className="text-white text-2xl font-semibold">Inicio Rapido</Text>
            <View className="flex-row justify-evenly">
                <Button className="flex-col w-[45%] h-28 bg-[#c21409] mt-3">
                    <AntDesign
                        name="caretright"
                        size={30}
                        color={"#FFF"}
                    />
                    <Text className="text-white font-extrabold">
                        Iniciar Treino
                    </Text>
                </Button>
                <Button className="flex-col w-[45%] h-28 bg-secondary mt-3">
                    <Octicons
                        name="graph"
                        size={30}
                        color={"#4abdd4"}
                    />
                    <Text className="text-white font-extrabold">
                        Ver Progresso
                    </Text>
                </Button>
            </View>
        </View>
    )
}