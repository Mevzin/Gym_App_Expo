import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import Button from "../ui/button";
import { authService } from "../../services/api";
import { formatCurrentDate } from "../../utils/dateUtils";
import CardProfileSkeleton from "./skeleton";

export default function CardProfile() {
    const [userName, setUserName] = useState('Usuário');
    const [currentDate, setCurrentDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
        setCurrentDate(formatCurrentDate());
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const user = await authService.getCurrentUser();
            if (user && user.name) {
                setUserName(user.name);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CardProfileSkeleton />;
    }

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
                    <Text className="text-xl text-gray-50 font-bold mt-[-5px]">{userName}</Text>
                    <Text className="text-sm text-gray-400 font-bold mt-[-5px]">{currentDate}</Text>
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