import * as ibantools from "ibantools";

export function validateIBAN(iban: string) {
  const validation = ibantools.validateIBAN(iban);
  return validation.valid;
}
