export const RANGE = {
  min: 18,
  max: 30,
};

export function calculateImc(weight: number, height: number): number {
  return weight / (height / 100) ** 2;
}

export function imcInRange(weight: number, height: number): boolean {
  const imc = calculateImc(weight, height);
  return imc >= RANGE.min && imc <= RANGE.max;
}
