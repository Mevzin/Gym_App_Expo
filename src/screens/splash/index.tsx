import React, { useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, Image, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const navigation = useNavigation();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeOutAnim = useRef(new Animated.Value(1)).current;
    const logoScaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(logoScaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: width,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeOutAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ]).start(() => {
                checkAuthAndNavigate();
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const checkAuthAndNavigate = async () => {
        try {
            const isAuthenticated = await authService.isAuthenticated();
            if (isAuthenticated) {
                navigation.navigate('AppTabs' as never);
            } else {
                navigation.navigate('Login' as never);
            }
        } catch (error) {
            navigation.navigate('Login' as never);
        }
    };

    return (
        <View className="flex-1 bg-primary">
            <Animated.View 
                style={[
                    {
                        flex: 1,
                        opacity: fadeOutAnim,
                        transform: [{ translateX: slideAnim }]
                    }
                ]}
            >
                <SafeAreaView className="flex-1 bg-primary">
                <View className="flex-1 justify-center items-center px-8">
                    <Animated.View 
                        style={[
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: logoScaleAnim }]
                            }
                        ]}
                        className="items-center"
                    >
                        <Image
                            source={require('../../../assets/icon.png')}
                            style={{ width: 120, height: 120 }}
                            resizeMode="contain"
                        />
                        <Text className="text-white text-4xl font-bold mt-6">FITNESS CENTER</Text>
                        <Text className="text-gray-400 text-lg mt-2">Seu parceiro de treino</Text>
                        
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