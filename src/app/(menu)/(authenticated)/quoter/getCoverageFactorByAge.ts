export function getCoverageFactorByAge(age: number): number {
  if (!Number.isFinite(age) || age < 0) return 0;

  if (age < 18) {
    return 0;
  }
  if (age <= 29) {
    return 15;
  }
  if (age <= 34) {
    return 14;
  }
  if (age <= 39) {
    return 13;
  }
  if (age <= 44) {
    return 11;
  }
  if (age <= 49) {
    return 10;
  }
  if (age <= 54) {
    return 8;
  }
  if (age <= 59) {
    return 7;
  }
  if (age <= 64) {
    return 6;
  }
  if (age <= 69) {
    return 5;
  }
  return 4;
}
