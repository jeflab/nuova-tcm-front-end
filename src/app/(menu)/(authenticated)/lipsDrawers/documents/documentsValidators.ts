import {
  isPaymentValid,
  LipWithPayment,
} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export function amlBlocked(lip: Lip | PreliminaryData | null) {
  if (!isPaymentValid(lip)) {
    return false;
  }

  return lip.aml?.blocked ?? false;
}
export function externalPaymentBlocked(lip: LipWithPayment) {
  return (
    lip.payment.paymentType === "credit-card" && !lip.payment.clicPayLinkClicked
  );
}
export function externalPaymentClicked(lip: LipWithPayment) {
  return (
    lip.payment.paymentType === "credit-card" && lip.payment.clicPayLinkClicked
  );
}
function molliePaymentBlocked(lip: LipWithPayment) {
  return lip.payment.paymentType === "mollie" && !lip.payment.mollieLinkClicked;
}
export function mollieLinkClicked(lip: Lip | PreliminaryData | null) {
  if (!isPaymentValid(lip)) {
    return false;
  }

  return lip.payment.mollieLinkClicked;
}

export function isDocumentsBlocked(lip: Lip | PreliminaryData | null) {
  if (!isPaymentValid(lip)) {
    return false;
  }

  return (
    amlBlocked(lip) || externalPaymentBlocked(lip) || molliePaymentBlocked(lip)
  );
}

export function isDocumentsWaitingForConsent(
  lip: Lip | PreliminaryData | null,
) {
  if (!isPaymentValid(lip)) {
    return false;
  }

  return lip.privacyCompany && lip.privacyCompany.length > 0;
}

export type LipWithDocuments = LipWithPayment & {
  eSigns: NonNullable<Lip["eSigns"]>;
};
export function isDocumentsValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithDocuments {
  if (!isPaymentValid(lip)) {
    return false;
  }

  let requiredProposalESign = 3;
  if (lip?.mustAskUnderwriting) {
    requiredProposalESign++;
  }
  if (lip?.type !== "self-insured") {
    requiredProposalESign++;
  }

  return !!(
    lip.eSigns?.polizza &&
    Object.keys(lip?.eSigns?.polizza).length === requiredProposalESign &&
    lip.eSigns.identificazione
  );
}
