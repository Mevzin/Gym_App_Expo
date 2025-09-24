import React from 'react';
import { View, Text } from 'react-native';

interface VisualCardProps {
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
  holderName?: string;
}

export const VisualCard: React.FC<VisualCardProps> = ({
  cardNumber = '',
  expiryMonth = '',
  expiryYear = '',
  cvc = '',
  holderName = ''
}) => {
  // Formatar número do cartão com espaços
  const formatCardNumber = (number: string) => {
    if (!number) return '•••• •••• •••• ••••';
    
    // Se é apenas os últimos 4 dígitos
    if (number.includes('****')) {
      return number;
    }
    
    const cleaned = number.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    
    // Preencher com pontos se não estiver completo
    const parts = formatted.split(' ');
    while (parts.length < 4) {
      parts.push('••••');
    }
    
    return parts.join(' ');
  };

  // Formatar data de expiração
  const formatExpiry = () => {
    if (expiryMonth && expiryYear) {
      return `${expiryMonth.padStart(2, '0')}/${expiryYear.slice(-2)}`;
    }
    return '••/••';
  };

  // Detectar tipo do cartão baseado no número
  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Cartão';
  };

  return (
    <View className="mx-4 mb-6">
      {/* Cartão Frente */}
      <View className="relative">
        <View className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
          {/* Header do cartão */}
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-white text-sm font-medium opacity-80">
              {getCardType(cardNumber)}
            </Text>
            <View className="bg-yellow-400 w-8 h-6 rounded opacity-80" />
          </View>

          {/* Número do cartão */}
          <View className="mb-6">
            <Text className="text-white text-xl font-mono tracking-wider">
              {formatCardNumber(cardNumber)}
            </Text>
          </View>

          {/* Informações do cartão */}
          <View className="flex-row justify-between items-end">
            <View className="flex-1">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Nome do Portador
              </Text>
              <Text className="text-white text-sm font-medium">
                {holderName || 'SEU NOME AQUI'}
              </Text>
            </View>
            <View className="ml-4">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Validade
              </Text>
              <Text className="text-white text-sm font-mono">
                {formatExpiry()}
              </Text>
            </View>
          </View>
        </View>

        {/* Cartão Verso (CVC) */}
        <View className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600 mt-4">
          <View className="bg-gray-900 h-8 w-full rounded mb-4" />
          <View className="flex-row justify-end">
            <View className="bg-white rounded px-3 py-2 min-w-[60px]">
              <Text className="text-gray-800 text-sm font-mono text-center">
                {cvc || '•••'}
              </Text>
            </View>
          </View>
          <Text className="text-gray-400 text-xs mt-2 text-right">CVC</Text>
        </View>
      </View>

      {/* Indicadores de segurança */}
      <View className="flex-row justify-center items-center mt-4 space-x-4">
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          <Text className="text-xs text-gray-600">SSL Seguro</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
          <Text className="text-xs text-gray-600">Criptografado</Text>
        </View>
      </View>
    </View>
  );
};