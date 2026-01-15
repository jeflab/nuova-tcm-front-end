import {isBeneficiariesValid} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/beneficiariesValidators";
import {isCertificateValid} from "@/app/(menu)/(authenticated)/lipsDrawers/certificate/certificateValidators";
import {isContractorContactsValid} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorContacts/contractorContactsValidors";
import {isContractorDataValid} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorData/contractorDataValidators";
import {
  isContractorFiscalCodeActive,
  isContractorFiscalCodeValid,
} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorFiscalCode/contractorFiscalCodeValidators";
import {isContractorPersonalAreaActivationValid} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/contractorPersonalAreaActivationValidators";
import {
  isDenActive,
  isDenValid,
} from "@/app/(menu)/(authenticated)/lipsDrawers/den/denValidators";
import {
  isDocumentsBlocked,
  isDocumentsValid,
  isDocumentsWaitingForConsent,
} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {fatcaValidators} from "@/app/(menu)/(authenticated)/lipsDrawers/fatca/fatcaValidators";
import {isHealthcareQuestionnaireValid} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/healthQuestionnaireValidators";
import {isContractorIdentificationValid} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/identificationValidators";
import {isInsuredDataValid} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredData/insuredDataValidators";
import {isInsuredIdentificationValid} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredIdentification/insuredIdentificationValidators";
import {
  isPaymentBlocked,
  isPaymentValid,
} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {isQuoteValid} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/quoteValidators";
import {isLip, Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {DrawerState, presetButtons} from "@/ui/drawer/types";
import {DrawerName} from "../lips/[id]/drawers";

function isPrivacyESigned(lip: Lip) {
  return !!lip?.contractor?.lastPrivacyESignId;
}

function allowUpdatesBeforePayment(lip: Lip) {
  const underwritingUnderInvestigation = lip.lipState.id === 2; // 2: Underwriting sanitario
  const underwritingNotApproved = lip.lipState.id === 15; // 15: Non approvata dopo revisione underwriting sanitario
  const underwritingApproved = lip.lipState.id === 14; // 14: Approvata dopo revisione underwriting sanitario

  return (
    !atLeastOneESign(lip) &&
    !underwritingUnderInvestigation &&
    !underwritingNotApproved &&
    !underwritingApproved
  );
}

function atLeastOneESign(lip: Lip) {
  return (
    (lip.eSigns?.polizza && Object.keys(lip.eSigns.polizza).length > 0) ||
    (lip.eSigns?.identificazione &&
      Object.keys(lip.eSigns.identificazione).length > 0)
  );
}

export function computeDrawerStates(
  lip: Lip | PreliminaryData | null,
): Partial<Record<DrawerName, DrawerState>> {
  const drawerStates: Partial<Record<DrawerName, DrawerState>> = {};

  if (!lip) {
    return {type: {variant: "active", ...presetButtons.compile}};
  }

  // type
  if (lip.type === undefined) {
    drawerStates.type = {variant: "active", ...presetButtons.compile};
  } else {
    drawerStates.type = {variant: "success"};
  }

  // fatca
  if (drawerStates.type?.variant === "success") {
    if (lip.contractor?.fatca === undefined) {
      drawerStates.fatca = {variant: "active", ...presetButtons.compile};
    } else if (fatcaValidators(lip)) {
      drawerStates.fatca = {variant: "success"};
    } else {
      drawerStates.fatca = {variant: "danger", ...presetButtons.update};
    }
  } else {
    drawerStates.fatca = undefined;
  }

  // contractor fiscal code
  if (drawerStates.fatca?.variant === "success") {
    if (isContractorFiscalCodeActive(lip)) {
      drawerStates.contractorFiscalCode = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else if (isContractorFiscalCodeValid(lip)) {
      drawerStates.contractorFiscalCode = {variant: "success"};
    } else {
      drawerStates.contractorFiscalCode = {variant: "danger"};
    }
  } else {
    drawerStates.contractorFiscalCode = undefined;
  }

  // Contatti Contraente
  if (drawerStates.contractorFiscalCode?.variant === "success") {
    if (!isLip(lip) || !isContractorContactsValid(lip)) {
      drawerStates.contractorContacts = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.contractorContacts = {
        variant: "success",
        ...(!isPrivacyESigned(lip) && presetButtons.update),
      };
    }
  } else {
    drawerStates.contractorContacts = undefined;
  }

  if (!isLip(lip)) {
    return drawerStates;
  }

  // Attesa creazione area Contraente
  if (drawerStates.contractorContacts?.variant === "success") {
    if (!isContractorPersonalAreaActivationValid(lip)) {
      drawerStates.contractorPersonalAreaActivation = {
        variant: "active",
        ...presetButtons.privacyEsign,
      };
    } else {
      drawerStates.contractorPersonalAreaActivation = {
        variant: "success",
      };
    }
  } else {
    drawerStates.contractorPersonalAreaActivation = undefined;
  }

  // Censimento Contraente
  if (drawerStates.contractorPersonalAreaActivation?.variant === "success") {
    if (!isContractorDataValid(lip)) {
      drawerStates.contractorData = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.contractorData = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  } else {
    drawerStates.contractorData = undefined;
  }

  // Identificazione Contraente
  if (drawerStates.contractorData?.variant === "success") {
    if (!isContractorIdentificationValid(lip)) {
      drawerStates.identification = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.identification = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  } else {
    drawerStates.identification = undefined;
  }

  // Demand and needs
  if (drawerStates.identification?.variant === "success") {
    if (isDenActive(lip)) {
      drawerStates.den = {variant: "active", ...presetButtons.compile};
    } else if (isDenValid(lip)) {
      drawerStates.den = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    } else {
      drawerStates.den = {
        variant: "danger",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  } else {
    drawerStates.den = undefined;
  }

  // Censimento Assicurato
  if (drawerStates.den?.variant === "success") {
    if (!isInsuredDataValid(lip)) {
      drawerStates.insuredData = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.insuredData = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  } else {
    drawerStates.insuredData = undefined;
  }

  // Identificazione Assicurato
  if (drawerStates.insuredData?.variant === "success") {
    if (!isInsuredIdentificationValid(lip)) {
      drawerStates.insuredIdentification = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.insuredIdentification = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  } else {
    drawerStates.insuredIdentification = undefined;
  }

  // Preventivo
  if (
    (lip?.type !== "third-party-insured" &&
      drawerStates.den?.variant === "success") ||
    drawerStates.insuredIdentification?.variant === "success"
  ) {
    if (!isQuoteValid(lip)) {
      drawerStates.quote = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.quote = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  } else {
    drawerStates.quote = undefined;
  }

  // Questionario sanitario / non sanitario
  if (drawerStates.quote?.variant === "success") {
    if (!isHealthcareQuestionnaireValid(lip)) {
      drawerStates.healthQuestionnaire = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.healthQuestionnaire = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  }

  // Beneficiari
  if (drawerStates.healthQuestionnaire?.variant === "success") {
    if (!isBeneficiariesValid(lip)) {
      drawerStates.beneficiaries = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.beneficiaries = {
        variant: "success",
        ...(allowUpdatesBeforePayment(lip) && presetButtons.update),
      };
    }
  }

  // Pagamento
  const blockPayment = isPaymentBlocked(lip);
  if (drawerStates.beneficiaries?.variant === "success") {
    if (blockPayment) {
      drawerStates.payment = {
        variant: blockPayment === 2 ? "waiting" : "danger",
        isLocked: true,
      };
    } else if (!isPaymentValid(lip)) {
      drawerStates.payment = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.payment = {
        variant: "success",
        ...(!atLeastOneESign(lip) && presetButtons.update),
      };
    }
  }

  // Documentazione
  if (drawerStates.payment?.variant === "success") {
    if (isDocumentsBlocked(lip)) {
      drawerStates.documentation = {variant: "waiting", isLocked: true};
    } else if (isDocumentsValid(lip)) {
      drawerStates.documentation = {variant: "success"};
    } else if (isDocumentsWaitingForConsent(lip)) {
      drawerStates.documentation = {
        variant: "active",
        ...presetButtons.checkConsent,
      };
    } else {
      drawerStates.documentation = {
        variant: "active",
        ...presetButtons.documentEsign,
      };
    }
  }

  // Certificato
  if (drawerStates.documentation?.variant === "success") {
    if (!isCertificateValid(lip)) {
      drawerStates.certificate = {
        variant: "waiting",
      };
    } else {
      drawerStates.certificate = {
        variant: "success",
      };
    }
  }

  return drawerStates;
}
