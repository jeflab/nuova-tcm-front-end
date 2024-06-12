import {Lip} from "@/models/entities/lip";

export function validateDenDuration(den?: Lip["den"]): boolean {
  if (!den) return false;

  return den.duration.response === "long_term";
}

export function validateDenExpectation(den?: Lip["den"]): boolean {
  if (!den) return false;

  return (["capital_and_personal_protection"] as const).some((value) =>
    den.expectations.response.includes(value),
  );
}

export function validateDen(den: Lip["den"] | null): boolean {
  if (!den) return false;

  return validateDenDuration(den) && validateDenExpectation(den);
}

export function validateLip(lip: Lip | null): boolean {
  if (!lip) return false;

  return validateDen(lip.den);
}
