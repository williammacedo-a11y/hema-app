export const DELIVERY_RULES = {
  MAX_WEIGHT_KG: 6,
};

export function calculateDeliveryFee(city?: string): number {
  if (!city) return 0;

  // Normaliza a string para evitar problemas com acentos e maiúsculas
  const normalizedCity = city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const tier10 = [
    'curitiba',
    'araucaria',
    'balsa nova',
    'pinhais',
    'sao jose dos pinhais',
  ];
  const tier15 = ['colombo', 'almirante tamandare', 'piraquara'];

  if (tier10.includes(normalizedCity)) return 10.0;
  if (tier15.includes(normalizedCity)) return 15.0;

  // Retorna -1 para cidades que não entregamos
  return -1;
}
