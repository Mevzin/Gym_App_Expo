import React, { useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

export default function SplashScreen() {
    const navigation = useNavigation();
    const { isAuthenticated, isLoading } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeOutAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(fadeOutAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }).start(() => {
                checkAuthAndNavigate();
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            checkAuthAndNavigate();
        }
    }, [isLoading, isAuthenticated]);

    const checkAuthAndNavigate = async () => {
        if (isLoading) {
            return;
        }
        
        if (isAuthenticated) {
            navigation.navigate('AppTabs' as never);
        } else {
            navigation.navigate('Login' as never);
        }
    };

    return (
        <View className="flex-1 bg-primary">
            <Animated.View 
                style={[
                    {
                        flex: 1,
                        opacity: fadeOutAnim
                    }
                ]}
            >
                <SafeAreaView className="flex-1 bg-primary">
                <View className="flex-1 justify-center items-center px-8">
                    <Animated.View 
                        style={[
                            {
                                opacity: fadeAnim
                            }
                        ]}
                        className="items-center"
                    >
                        <Image
                            source={require('../../../assets/icon.png')}
                            style={{ width: 120, height: 120 }}
                            resizeMode="contain"
                        />
                        <Text className="text-white text-4xl font-roboto-bold mt-6">FITNESS CENTER</Text>
                        <Text className="text-gray-400 text-lg font-roboto-regular mt-2">Seu parceiro de treino</Text>
                        
                        <View className="mt-8">
                            <View className="w-16 h-1 bg-[#c21409] rounded-full" />
                        </View>
                    </Animated.View>
                </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}