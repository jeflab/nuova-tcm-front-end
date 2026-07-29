import {
  isBeneficiariesValid,
  LipWithBeneficiaries,
} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/beneficiariesValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export function askForUnderwriting(lip: LipWithBeneficiaries) {
  return !!lip.mustAskUnderwriting && [0, 1].includes(lip.lipState.id);
}
function underwritingUnderInvestigation(lip: LipWithBeneficiaries) {
  return lip.lipState.id === 2;
}
function underwritingNotApproved(lip: LipWithBeneficiaries) {
  return lip.lipState.id === 15;
}

export function isPaymentBlocked(lip: Lip | PreliminaryData | null) {
  if (!isBeneficiariesValid(lip)) {
    return false;
  }

  return askForUnderwriting(lip) || underwritingUnderInvestigation(lip)
    ? 2
    : underwritingNotApproved(lip)
      ? 15
      : false;
}

export type LipWithPayment = LipWithBeneficiaries & {
  payment: NonNullable<Lip["payment"]>;
};
export function isPaymentValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithPayment {
  if (!isBeneficiariesValid(lip)) {
    return false;
  }

  return !!lip.payment;
}
