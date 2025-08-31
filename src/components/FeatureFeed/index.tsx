import { Text, View } from "react-native";
import LargeButton from "../LargerButton";

export default function FeatureFeed() {
    return (
        <View className="w-[95%]">
            <Text className="text-white text-2xl font-extrabold font-roboto">
                Features
            </Text>
            <View className="flex items-center">
                <LargeButton color="#ff1500" title="Iniciar Treino" description="Inicie agora seu treino!" icon="search" />
                <LargeButton color="#14b0c7" title="Alterar treino" description="Realize alterações em seus treinos!" icon="search" />
                <LargeButton color="#ff1500" title="Seu Progresso" description="Monitore seu progresso nos treinos!" icon="search" />
                <LargeButton color="#14b0c7" title="Agenda" description={`Agende um dia especifico para treinar com acompanhamento`} icon="search" />
            </View>
        </View>
    )
}