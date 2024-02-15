export const RANGE = {
  min: 18,
  max: 30,
};

export function calculateImc(weight: number, height: number): number {
  return weight / (height / 100) ** 2;
}
