import {isBeneficiariesValid} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/beneficiariesValidators";
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

  return drawerStates;
}

export function computeDrawerStatesOld(
  lip: Lip | PreliminaryData | null,
): Partial<Record<DrawerName, DrawerState>> {
  const drawerStates: Partial<Record<DrawerName, DrawerState>> = {};

  if (lip.type === undefined) {
    drawerStates.type = {variant: "active", ...presetButtons.compile};
  } else {
    drawerStates.type = {variant: "success"};
  }

  // Shared helpers
  const atLeastOneESign =
    (lip?.eSigns?.polizza && Object.keys(lip?.eSigns?.polizza).length > 0) ||
    (lip?.eSigns?.identificazione &&
      Object.keys(lip?.eSigns?.identificazione).length > 0);
  const privacyESigned = !!lip?.contractor?.lastPrivacyESignId;

  const askForUnderwriting =
    (lip?.mustAskUnderwriting ?? false) &&
    lip &&
    lip?.beneficiaries &&
    (lip?.lipState?.id === 0 || lip?.lipState.id === 1);
  const underwritingUnderInvestigation = lip?.lipState?.id === 2;
  const underwritingNotApproved = lip?.lipState?.id === 15;
  const underwritingApproved = lip?.lipState?.id === 14;
  const allowUpdatesBeforePayment =
    !atLeastOneESign &&
    !underwritingUnderInvestigation &&
    !underwritingNotApproved &&
    !underwritingApproved;

  const blockPayment =
    askForUnderwriting || underwritingUnderInvestigation
      ? 2
      : underwritingNotApproved
        ? 15
        : false;
  const amlBlocked = lip?.aml?.blocked ?? false;
  const externalPaymentBlocked =
    lip?.payment?.paymentType === "credit-card" &&
    !lip?.payment?.clicPayLinkClicked;
  const molliePaymentBlocked =
    lip?.payment?.paymentType === "mollie" && !lip?.payment?.mollieLinkClicked;

  if (isPreliminary) {
    // Prelim: fatca
    if (drawerStates.type?.variant === "success") {
      if (preliminaryData?.fatca === undefined) {
        drawerStates.fatca = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (
        preliminaryData.fatca === "no" &&
        preliminaryData.italianResidency === "yes" &&
        (preliminaryData.type === "self-insured" ||
          (preliminaryData.insuredFatca === "no" &&
            preliminaryData.insuredItalianResidency === "yes"))
      ) {
        drawerStates.fatca = {variant: "success"};
      } else {
        drawerStates.fatca = {variant: "danger", ...presetButtons.update};
      }
    } else {
      drawerStates.fatca = undefined;
    }

    // contractor fiscal code
    if (drawerStates.fatca?.variant === "success") {
      if (
        !preliminaryData?.contractorAlreadyRegistered &&
        preliminaryData?.contractorPersonalData === undefined
      ) {
        drawerStates.contractorFiscalCode = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (!preliminaryData?.contractorAlreadyRegistered) {
        drawerStates.contractorFiscalCode = {variant: "success"};
      } else {
        drawerStates.contractorFiscalCode = {variant: "danger"};
      }
    } else {
      drawerStates.contractorFiscalCode = undefined;
    }

    // Contatti Contraente
    if (drawerStates.contractorFiscalCode?.variant === "success") {
      drawerStates.contractorContacts = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      drawerStates.contractorContacts = undefined;
    }
  } else {
    // Server-provided lip logic
    // fatca
    if (drawerStates.type?.variant === "success") {
      if (lip?.contractor?.fatca.fatcaCheck.response === undefined) {
        drawerStates.fatca = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (
        lip?.contractor.fatca.fatcaCheck.response === "no" &&
        lip?.contractor.fatca.residencyCheck.response === "yes" &&
        (lip?.type === "self-insured" ||
          !lip?.insured ||
          (lip?.insured?.fatca.fatcaCheck.response === "no" &&
            lip?.insured?.fatca.residencyCheck.response === "yes"))
      ) {
        drawerStates.fatca = {variant: "success"};
      } else {
        drawerStates.fatca = {variant: "danger"};
      }
    } else {
      drawerStates.fatca = undefined;
    }

    // contractor fiscal code
    if (drawerStates.fatca?.variant === "success") {
      if (lip?.contractor === undefined) {
        drawerStates.contractorFiscalCode = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        drawerStates.contractorFiscalCode = {variant: "success"};
      }
    } else {
      drawerStates.contractorFiscalCode = undefined;
    }

    // Contatti Contraente
    if (drawerStates.contractorFiscalCode?.variant === "success") {
      if (lip?.contractor.phone === null || lip?.contractor.email === null) {
        drawerStates.contractorContacts = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        drawerStates.contractorContacts = {
          variant: "success",
          ...(!privacyESigned && presetButtons.update),
        };
      }
    } else {
      drawerStates.contractorContacts = undefined;
    }

    // Attesa creazione area Contraente
    if (drawerStates.contractorContacts?.variant === "success") {
      if (lip?.contractor.lastPrivacyESignId === null) {
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
      if (lip?.contractor.city === null) {
        drawerStates.contractorData = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        drawerStates.contractorData = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      }
    } else {
      drawerStates.contractorData = undefined;
    }

    // Identificazione Contraente
    if (drawerStates.contractorData?.variant === "success") {
      if (
        !lip?.contractor?.identityDocument ||
        lip.contractor.identityDocument.length === 0
      ) {
        drawerStates.identification = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (lip.contractor.identityDocument.length > 0) {
        drawerStates.identification = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      } else {
        drawerStates.identification = {variant: "danger"};
      }
    } else {
      drawerStates.identification = undefined;
    }

    // Demand and needs
    if (drawerStates.identification?.variant === "success") {
      if (lip?.den === null) {
        drawerStates.den = {variant: "active", ...presetButtons.compile};
      } else if (validateDen(lip?.den)) {
        drawerStates.den = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      } else {
        drawerStates.den = {
          variant: "danger",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      }
    } else {
      drawerStates.den = undefined;
    }

    // Censimento Assicurato
    if (drawerStates.den?.variant === "success") {
      if (!lip?.insured?.city) {
        drawerStates.insuredData = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        drawerStates.insuredData = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      }
    } else {
      drawerStates.insuredData = undefined;
    }

    // Identificazione Assicurato
    if (drawerStates.insuredData?.variant === "success") {
      if (
        !lip?.insured?.identityDocument ||
        lip.insured.identityDocument.length === 0
      ) {
        drawerStates.insuredIdentification = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (lip.insured.identityDocument.length > 0) {
        drawerStates.insuredIdentification = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      } else {
        drawerStates.insuredIdentification = {variant: "danger"};
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
      if (lip?.quotation === null) {
        drawerStates.quote = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (lip?.quotation?.premium) {
        drawerStates.quote = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      } else {
        drawerStates.quote = {variant: "danger"};
      }
    } else {
      drawerStates.quote = undefined;
    }

    // Questionario sanitario / non sanitario
    if (drawerStates.quote?.variant === "success") {
      if (!lip?.healthcareQuestionnaire) {
        drawerStates.healthQuestionnaire = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        drawerStates.healthQuestionnaire = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      }
    }

    // Beneficiari
    if (drawerStates.healthQuestionnaire?.variant === "success") {
      if (!lip?.beneficiaries) {
        drawerStates.beneficiaries = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        drawerStates.beneficiaries = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      }
    }

    // Pagamento
    if (drawerStates.beneficiaries?.variant === "success") {
      if (blockPayment) {
        drawerStates.payment = {
          variant: blockPayment === 2 ? "waiting" : "danger",
          isLocked: true,
        };
      } else if (lip?.payment === null) {
        drawerStates.payment = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        drawerStates.payment = {
          variant: "success",
          ...(!atLeastOneESign && presetButtons.update),
        };
      }
    }

    // Documentazione
    let requiredProposalESign = 3;
    if (lip?.mustAskUnderwriting) {
      requiredProposalESign++;
    }
    if (lip?.type !== "self-insured") {
      requiredProposalESign++;
    }
    if (drawerStates.payment?.variant === "success") {
      if (amlBlocked || externalPaymentBlocked || molliePaymentBlocked) {
        drawerStates.documentation = {variant: "waiting", isLocked: true};
      } else if (
        lip?.eSigns?.polizza &&
        Object.keys(lip?.eSigns?.polizza).length === requiredProposalESign &&
        lip.eSigns.identificazione
      ) {
        drawerStates.documentation = {variant: "success"};
      } else if (!lip?.privacyCompany || lip.privacyCompany.length === 0) {
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
      if (!lip?.certificate) {
        drawerStates.certificate = {
          variant: "waiting",
        };
      } else {
        drawerStates.certificate = {
          variant: "success",
        };
      }
    }
  }

  return drawerStates;
}
