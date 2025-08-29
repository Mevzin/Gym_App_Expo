import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        setIsLoading(true);

        try {
    
            const response = await authService.login(email, password);

            if (response.token) {
                setIsLoading(false);
                navigation.navigate('AppTabs' as never);
            } else {
                throw new Error('Falha na autenticação');
            }
        } catch (error) {
            setIsLoading(false);
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
                    <Image
                        source={require('../../../assets/icon.png')}
                        style={{ width: 80, height: 80 }}
                        resizeMode="contain"
                    />
                    <Text className="text-white text-3xl font-bold mt-4">FITNESS CENTER</Text>
                    <Text className="text-gray-400 text-lg">Seu parceiro de treino</Text>
                </View>

                <View className="w-full mb-6">
                    <Text className="text-white text-lg font-bold mb-2">Email</Text>
                    <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                        <FontAwesome name="envelope-o" size={20} color="#9ba1ad" />
                        <TextInput
                            className="flex-1 text-white ml-3"
                            placeholder="Seu email"
                            placeholderTextColor="#9ba1ad"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                </View>

                <View className="w-full mb-8">
                    <Text className="text-white text-lg font-bold mb-2">Senha</Text>
                    <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                        <FontAwesome name="lock" size={20} color="#9ba1ad" />
                        <TextInput
                            className="flex-1 text-white ml-3"
                            placeholder="Sua senha"
                            placeholderTextColor="#9ba1ad"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
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