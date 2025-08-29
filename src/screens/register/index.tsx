import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import Button from '../../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!name || !email || !username || !password || !confirmPassword || !weight || !age) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }

        setIsLoading(true);

        try {
        
            const userData = {
                name,
                email,
                username,
                password,
                weight: parseFloat(weight),
                age: parseInt(age, 10)
            };

            const response = await authService.register(userData);

            setIsLoading(false);
            Alert.alert('Sucesso', 'Conta criada com sucesso!', [
                { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
            ]);
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Erro', 'Falha ao criar conta. Tente novamente.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-1 justify-center items-center px-8 py-10">
                    <View className="w-full items-center mb-8">
                        <MaterialCommunityIcons
                            name="weight-lifter"
                            size={60}
                            color="#c21409"
                        />
                        <Text className="text-white text-3xl font-bold mt-2">CRIAR CONTA</Text>
                        <Text className="text-gray-400 text-lg">Comece sua jornada fitness</Text>
                    </View>

                    <View className="w-full mb-4">
                        <Text className="text-white text-lg font-bold mb-2">Nome</Text>
                        <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                            <FontAwesome name="user" size={20} color="#9ba1ad" />
                            <TextInput
                                className="flex-1 text-white ml-3"
                                placeholder="Seu nome completo"
                                placeholderTextColor="#9ba1ad"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View className="w-full mb-4">
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

                    <View className="w-full mb-4">
                        <Text className="text-white text-lg font-bold mb-2">Nome de usuário</Text>
                        <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                            <FontAwesome name="at" size={20} color="#9ba1ad" />
                            <TextInput
                                className="flex-1 text-white ml-3"
                                placeholder="Seu nome de usuário"
                                placeholderTextColor="#9ba1ad"
                                autoCapitalize="none"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>
                    </View>

                    <View className="w-full mb-4">
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

                    <View className="w-full mb-4">
                        <Text className="text-white text-lg font-bold mb-2">Confirmar Senha</Text>
                        <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                            <FontAwesome name="lock" size={20} color="#9ba1ad" />
                            <TextInput
                                className="flex-1 text-white ml-3"
                                placeholder="Confirme sua senha"
                                placeholderTextColor="#9ba1ad"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                    </View>

                    <View className="w-full flex-row justify-between mb-4">
                        <View className="w-[48%]">
                            <Text className="text-white text-lg font-bold mb-2">Peso (kg)</Text>
                            <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                                <MaterialCommunityIcons name="weight-kilogram" size={20} color="#9ba1ad" />
                                <TextInput
                                    className="flex-1 text-white ml-3"
                                    placeholder="Seu peso"
                                    placeholderTextColor="#9ba1ad"
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-white text-lg font-bold mb-2">Idade</Text>
                            <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                                <FontAwesome name="calendar" size={20} color="#9ba1ad" />
                                <TextInput
                                    className="flex-1 text-white ml-3"
                                    placeholder="Sua idade"
                                    placeholderTextColor="#9ba1ad"
                                    keyboardType="numeric"
                                    value={age}
                                    onChangeText={setAge}
                                />
                            </View>
                        </View>
                    </View>

                    <Button
                        className="w-full h-14 bg-[#c21409] py-4 rounded-lg items-center justify-center mt-4"
                        disabled={isLoading}
                        onPress={handleRegister}
                    >
                        {isLoading ? (
                            <Text className="text-white font-bold text-lg">Carregando...</Text>
                        ) : (
                            <Text className="text-white font-bold text-lg">CRIAR CONTA</Text>
                        )}
                    </Button>

                    <View className="flex-row mt-6 mb-4">
                        <Text className="text-gray-400">Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                            <Text className="text-cyan-400 font-bold">Faça login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}