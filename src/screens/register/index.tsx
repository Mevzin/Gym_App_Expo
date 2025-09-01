import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import Button from '../../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api';
import { validateEmail, validateRequired, validatePassword } from '../../utils/validation';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigation = useNavigation();

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
        } else if (!validatePassword(password)) {
            setPasswordError('Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!name || !username || !confirmPassword || !weight || !age) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            isValid = false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem');
            isValid = false;
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
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

            await authService.register(userData);

            setIsLoading(false);
            Alert.alert('Sucesso', 'Conta criada com sucesso!', [
                { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
            ]);
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Erro', 'Email já utilizado, por favor tente outro!.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-1 justify-center items-center px-8 py-10">
                    <View className="w-full items-center mb-8">
                        <View style={{
                            borderRadius: 47,
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
                        <Text className="text-white text-3xl font-bold mt-4 font-roboto">R3 FITNESS CENTER</Text>
                        <Text className="text-gray-400 text-lg font-roboto">Comece sua jornada fitness</Text>
                    </View>

                    <View className="w-full mb-4">
                        <Text className="text-white text-lg font-bold mb-2 font-roboto">Nome</Text>
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
                        {emailError ? <Text className="text-red-400 text-sm mt-1">{emailError}</Text> : null}
                    </View>

                    <View className="w-full mb-4">
                        <Text className="text-white text-lg font-bold mb-2 font-roboto">Email</Text>
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
                                    setEmail(text)
                                    if (emailError) {
                                        if (validateRequired(text) && validateEmail(text)) {
                                            setEmailError('')
                                        }
                                    }
                                }}
                            />
                        </View>
                        {passwordError ? <Text className="text-red-400 text-sm mt-1">{passwordError}</Text> : null}
                    </View>

                    <View className="w-full mb-4">
                        <Text className="text-white text-lg font-bold mb-2 font-roboto">Nome de usuário</Text>
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
                        <Text className="text-white text-lg font-bold mb-2 font-roboto">Senha</Text>
                        <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                            <FontAwesome name="lock" size={20} color="#9ba1ad" />
                            <TextInput
                                className="flex-1 text-white ml-3"
                                placeholder="Sua senha"
                                placeholderTextColor="#9ba1ad"
                                secureTextEntry
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text)
                                    if (passwordError) {
                                        if (validateRequired(text) && validatePassword(text)) {
                                            setPasswordError('')
                                        }
                                    }
                                }}
                            />
                        </View>
                    </View>

                    <View className="w-full mb-4">
                        <Text className="text-white text-lg font-bold mb-2 font-roboto">Confirmar Senha</Text>
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
                            <Text className="text-white text-lg font-bold mb-2 font-roboto">Peso (kg)</Text>
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
                            <Text className="text-white text-lg font-bold mb-2 font-roboto">Idade</Text>
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
                            <Text className="text-white font-bold text-lg font-roboto">Carregando...</Text>
                        ) : (
                            <Text className="text-white font-bold text-lg font-roboto">CRIAR CONTA</Text>
                        )}
                    </Button>

                    <View className="flex-row mt-6 mb-4">
                        <Text className="text-gray-400 font-roboto">Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                            <Text className="text-cyan-400 font-bold font-roboto">Faça login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}