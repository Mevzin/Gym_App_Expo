/**
 * Utilitários para formatação e conversão de preços
 * O Stripe trabalha com valores em centavos, então precisamos converter adequadamente
 */

/**
 * Converte um valor em reais para centavos (formato do Stripe)
 * @param priceInReais - Preço em reais (ex: 79.90)
 * @returns Preço em centavos (ex: 7990)
 */
export const convertToCents = (priceInReais: number): number => {
  return Math.round(priceInReais * 100);
};

/**
 * Converte um valor em centavos (formato do Stripe) para reais
 * @param priceInCents - Preço em centavos (ex: 7990)
 * @returns Preço em reais (ex: 79.90)
 */
export const convertToReais = (priceInCents: number): number => {
  return priceInCents / 100;
};

/**
 * Formata um preço para exibição em formato brasileiro
 * @param price - Preço em reais
 * @param currency - Moeda (padrão: 'BRL')
 * @returns String formatada (ex: "R$ 79,90")
 */
export const formatPrice = (price: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
};

/**
 * Formata um preço vindo do Stripe (em centavos) para exibição
 * @param priceInCents - Preço em centavos do Stripe
 * @param currency - Moeda (padrão: 'BRL')
 * @returns String formatada (ex: "R$ 79,90")
 */
export const formatStripePrice = (priceInCents: number, currency: string = 'BRL'): string => {
  const priceInReais = convertToReais(priceInCents);
  return formatPrice(priceInReais, currency);
};

/**
 * Valida se um preço é válido
 * @param price - Preço a ser validado
 * @returns true se o preço é válido
 */
export const isValidPrice = (price: number): boolean => {
  return price > 0 && !isNaN(price) && isFinite(price);
};