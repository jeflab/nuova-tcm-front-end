import {
  isContractorIdentificationValid,
  LipWithContractorIdentification,
} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/identificationValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithDen = LipWithContractorIdentification & {
  den: NonNullable<Lip["den"]>;
};

export function isDenActive(lip: Lip | PreliminaryData | null) {
  if (!isContractorIdentificationValid(lip)) {
    return false;
  }

  return !lip.den;
}

export function validateDenDuration(den?: Lip["den"]) {
  if (!den) return false;

  return den.duration.response === "long_term";
}

export function validateDenExpectation(den?: Lip["den"]) {
  if (!den) return false;

  return (["capital_and_personal_protection"] as const).some((value) =>
    den.expectations.response.includes(value),
  );
}

export function isDenValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithDen {
  if (!isContractorIdentificationValid(lip)) {
    return false;
  }
  if (!lip.den) {
    return false;
  }

  return validateDenDuration(lip.den) && validateDenExpectation(lip.den);
}
