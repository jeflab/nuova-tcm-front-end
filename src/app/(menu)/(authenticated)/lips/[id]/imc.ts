export function calculateImc(weight: number, height: number): number {
  return weight / (height / 100) ** 2;
}
