import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validateRequired } from '../../utils/validation';

export default function Login() {
    const navigation = useNavigation();
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateForm = () => {
        let isValid = true;

        if (!validateRequired(email)) {
            setEmailError('Email é obrigatório');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Email inválido');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!validateRequired(password)) {
            setPasswordError('Senha é obrigatória');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            await login(email, password);
            navigation.navigate('AppTabs' as never);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register' as never);
    };

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <View className="flex-1 justify-center items-center px-8">
                <View className="w-full items-center mb-10">
                    <View style={{
                        borderRadius: 50,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: 3
                    }}>
                        <View style={{
                            borderRadius: 47,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            padding: 3
                        }}>
                            <View style={{
                                borderRadius: 44,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                padding: 4,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image
                                    source={require('../../../assets/icon.png')}
                                    style={{ width: 80, height: 80 }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                    </View>
                    <Text className="text-white text-3xl font-roboto-bold mt-4">R3 FITNESS CENTER</Text>
                    <Text className="text-gray-400 text-lg font-roboto-regular">Seu parceiro de treino</Text>
                </View>

                <View className="w-full mb-6">
                    <Text className="text-white text-lg font-roboto-medium mb-2">Email</Text>
                    <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                        <FontAwesome name="envelope-o" size={20} color="#9ba1ad" />
                        <TextInput
                            className="flex-1 text-white ml-3"
                            placeholder="Seu email"
                            placeholderTextColor="#9ba1ad"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (emailError) {
                                    if (validateRequired(text) && validateEmail(text)) {
                                        setEmailError('');
                                    }
                                }
                            }}
                        />
                    </View>
                    {emailError ? <Text className="text-red-400 text-sm mt-1">{emailError}</Text> : null}
                </View>

                <View className="w-full mb-6">
                    <Text className="text-white text-lg font-roboto-medium mb-2">Senha</Text>
                    <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                        <FontAwesome name="lock" size={20} color="#9ba1ad" />
                        <TextInput
                            className="flex-1 text-white ml-3"
                            placeholder="Sua senha"
                            placeholderTextColor="#9ba1ad"
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (passwordError && validateRequired(text)) {
                                    setPasswordError('');
                                }
                            }}
                        />
                    </View>
                    {passwordError ? <Text className="text-red-400 text-sm mt-1">{passwordError}</Text> : null}
                </View>

                <Button
                    className="w-full h-23 bg-[#c21409] py-4 rounded-lg items-center justify-center mb-4"
                    disabled={isLoading}
                    onPress={handleLogin}
                >
                    {isLoading ? (
                        <Text className="text-white font-bold text-lg">Carregando...</Text>
                    ) : (
                        <Text className="text-white font-bold text-lg">ENTRAR</Text>
                    )}
                </Button>

                <TouchableOpacity className="mt-4">
                    <Text className="text-cyan-400 text-center">Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <View className="flex-row mt-8">
                    <Text className="text-gray-400">Não tem uma conta? </Text>
                    <TouchableOpacity onPress={handleRegister}>
                        <Text className="text-cyan-400 font-bold">Registre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}