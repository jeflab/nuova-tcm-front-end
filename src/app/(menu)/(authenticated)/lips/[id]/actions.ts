"use server";

import {BeneficiariesFormValues} from "@/app/(menu)/(authenticated)/lipsDrawers/BeneficiariesForm";
import {fatcaQuestions} from "@/app/(menu)/(authenticated)/lipsDrawers/FatcaForm";
import {HealthQuestionnaireFormValues} from "@/app/(menu)/(authenticated)/lipsDrawers/HealthQuestionnaireForm";
import {PaymentFormValues} from "@/app/(menu)/(authenticated)/lipsDrawers/PaymentForm";
import {
  dependentFamilyMembersOptions,
  DependentFamilyMembersOptions,
  durationOptions,
  DurationOptions,
  economicConditionOptions,
  EconomicConditionOptions,
  educationOptions,
  EducationOptions,
  expectationsOptions,
  ExpectationsOptions,
  familyOptions,
  FamilyOptions,
  FundSource,
  Gender,
  IdType,
  JobPosition,
  jobPositionOptions,
  needsToMeetOptions,
  NeedsToMeetOptions,
  PublicOffices,
  publicOfficesOptions,
  TAECode,
  tAECodeOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {lipSchema} from "@/models/entities/lip";
import {privacySchema} from "@/models/entities/privacy";
import {Option, YesNoAnswer, yesNoOptions} from "@/helpers/getOptionsLabel";
import {get, patch, post} from "@/services/api";
import {Tags} from "@/services/const";
import {invalidateTag} from "@/services/helpers";

const getLipShape = {
  lip: lipSchema,
};
export async function getLip(id: number) {
  return get(`/lips/${id}`, {
    payloadShape: getLipShape,
    tags: [Tags.getLip(id)],
  });
}

const checkContractorShape = {
  lip: lipSchema.optional(),
};
interface ActivateContractorParams {
  fatca: {
    label: string;
    text: string;
    options: readonly Option[];
    response: (typeof fatcaQuestions)["fatcaCheck"]["options"][number]["value"];
  };
  italianResidency: {
    label: string;
    text: string;
    options: readonly Option[];
    response: (typeof fatcaQuestions)["residencyCheck"]["options"][number]["value"];
  };
  birthDate: string;
  birthPlace: {
    city: string;
    province: string;
  };
  fiscalCode: string;
  gender: Gender;
  name: string;
  surname: string;
  email: string;
  phone: string;
}
export async function activateContractor(
  contractorData: ActivateContractorParams,
) {
  const data = {
    json_fatca: JSON.stringify({
      fatcaCheck: contractorData.fatca,
      residencyCheck: contractorData.italianResidency,
    }),
    fiscal_code: contractorData.fiscalCode,
    date_birth: contractorData.birthDate,
    place_birth:
      contractorData.birthPlace.province !== "EE"
        ? contractorData.birthPlace.city
        : "Estero",
    region_birth: contractorData.birthPlace.province,
    country_birth:
      contractorData.birthPlace.province !== "EE"
        ? "Italia"
        : contractorData.birthPlace.city,
    name: contractorData.name,
    surname: contractorData.surname,
    gender: contractorData.gender,
    email: contractorData.email,
    phone: contractorData.phone,
  };

  return await post("/lips/activate-contractor", {
    payloadShape: checkContractorShape,
    data,
  });
}

const checkIfFiscalCodeExistsShape = {
  lip: lipSchema.optional(),
};
export async function checkIfFiscalCodeExists(fiscalCode: string) {
  const data = {
    fiscal_code: fiscalCode,
  };

  return await post("/lips/check-contractor", {
    payloadShape: checkIfFiscalCodeExistsShape,
    data,
  });
}

interface updateContractorContactsParams {
  phone: string;
  email: string;
}
export async function updateContractorContacts(
  contractorId: number,
  lipId: number,
  formData: updateContractorContactsParams,
) {
  return patch(`/personal-datas/${contractorId}`, {
    data: {
      phone: formData.phone,
      email: formData.email,
    },
    tags: [Tags.getLip(lipId)],
  });
}

const lastPrivacyShape = {
  privacy: privacySchema,
};
export async function getLastPrivacy() {
  return get("/last-privacy", {payloadShape: lastPrivacyShape});
}

interface updateContractorDataParams {
  residence: {
    place: {
      city: string;
      province: string;
    };
    streetName: string;
    streetNumber: string;
    zipCode: string;
  };
  pep: {
    isPep: YesNoAnswer;
    publicOffice: PublicOffices;
    otherPep: YesNoAnswer;
  };
  job: {
    position: JobPosition;
    positionOther: string;
    tAECode: TAECode;
    province: string;
    country: string;
  };
}
export async function updateContractorData(
  contractorId: number,
  lipId: number,
  formData: updateContractorDataParams,
) {
  const data = {
    city: formData.residence.place.city,
    region: formData.residence.place.province,
    address: formData.residence.streetName,
    street_number: formData.residence.streetNumber,
    zip_code: formData.residence.zipCode,
    json_pep: JSON.stringify({
      isPep: {options: yesNoOptions, response: formData.pep.isPep},
      publicOffice: {
        options: publicOfficesOptions,
        response: formData.pep.publicOffice,
      },
      otherPep: {options: yesNoOptions, response: formData.pep.otherPep},
      job: {
        position: {
          options: jobPositionOptions,
          response: formData.job.position,
        },
        positionOther: formData.job.positionOther,
        tAECode: {options: tAECodeOptions, response: formData.job.tAECode},
        province: formData.job.province,
        country: formData.job.country,
      },
    }),
  };

  return patch(`/personal-datas/${contractorId}`, {
    data,
    tags: [Tags.getLip(lipId)],
  });
}

interface IdentificationContractorParams {
  frontPicture: File;
  backPicture: File;
  idType: IdType;
  number: string;
  issuedBy: string;
  issuedByOrg: string;
  issuedDate: string;
  expiringDate: string;
  fiscalCode: string;
}
export async function identificationContractor(
  formData: FormData,
  lipId: number,
) {
  return post("/identification-contractor", {
    data: formData,
    tags: [Tags.getLip(lipId)],
  });
}

interface UpdateDenParams {
  education: EducationOptions;
  job: JobPosition;
  family: FamilyOptions;
  dependentFamilyMembers: DependentFamilyMembersOptions;
  otherInsuranceProducts: YesNoAnswer;
  needsIntendToMeet: NeedsToMeetOptions[];
  savings: string;
  income: string;
  economicCondition: EconomicConditionOptions;
  fundSource: FundSource;
  fundSourceOther: string;
  expectations: ExpectationsOptions[];
  duration: DurationOptions;
}
export async function updateDen(formData: UpdateDenParams, lipId: number) {
  const data = {
    education: {options: educationOptions, response: formData.education},
    job: {options: jobPositionOptions, response: formData.job},
    family: {options: familyOptions, response: formData.family},
    dependentFamilyMembers: {
      options: dependentFamilyMembersOptions,
      response: formData.dependentFamilyMembers,
    },
    otherInsuranceProducts: {
      options: yesNoOptions,
      response: formData.otherInsuranceProducts,
    },
    needsIntendToMeet: {
      options: needsToMeetOptions,
      response: formData.needsIntendToMeet,
    },
    savings: formData.savings,
    income: formData.income,
    economicCondition: {
      options: economicConditionOptions,
      response: formData.economicCondition,
    },
    fundSource: formData.fundSource,
    fundSourceOther: formData.fundSourceOther,
    expectations: {
      options: expectationsOptions,
      response: formData.expectations,
    },
    duration: {options: durationOptions, response: formData.duration},
  };
  invalidateTag(Tags.getLip(lipId));
  return patch(`/lips/${lipId}`, {data: {json_den: JSON.stringify(data)}});
}

interface UpdateQuotationParams {
  birthDate: string;
  smoker: YesNoAnswer;
  death: string;
  accidentalDeath: boolean;
  trafficAccidentalDeath: boolean;
  exemptionFromPaying: boolean;
  tpi: {enabled: boolean; coverage: string};
  cancer: {enabled: boolean; coverage: string};
  tpd: {enabled: boolean; coverage: string};
  premium: number;
}
export async function updateQuotation(
  formData: UpdateQuotationParams,
  lipId: number,
  shouldResetHealthQuestionnaire: boolean = false,
) {
  const data = {
    birthDate: formData.birthDate,
    smoker: formData.smoker,
    death: parseInt(formData.death || "0", 10),
    accidentalDeath: formData.accidentalDeath,
    trafficAccidentalDeath: formData.trafficAccidentalDeath,
    exemptionFromPaying: formData.exemptionFromPaying,
    tpi: {
      enabled: formData.tpi.enabled,
      coverage: parseInt(formData.tpi.coverage || "0", 10),
    },
    cancer: {
      enabled: formData.cancer.enabled,
      coverage: parseInt(formData.cancer.coverage || "0", 10),
    },
    tpd: {
      enabled: formData.tpd.enabled,
      coverage: parseInt(formData.tpd.coverage || "0", 10),
    },
    premium: formData.premium,
  };

  invalidateTag(Tags.getLip(lipId));
  return patch(`/lips/${lipId}`, {
    data: {
      json_quotation: JSON.stringify(data),
      ...(shouldResetHealthQuestionnaire && {
        json_survey_healthcare: null,
      }),
    },
  });
}
export async function updateHealthQuestionnaire(
  formData: HealthQuestionnaireFormValues,
  lipId: number,
) {
  invalidateTag(Tags.getLip(lipId));
  return patch(`/lips/${lipId}`, {
    data: {json_survey_healthcare: JSON.stringify(formData)},
  });
}

export async function updateBeneficiaries(
  beneficiaries: BeneficiariesFormValues,
  lipId: number,
) {
  invalidateTag(Tags.getLip(lipId));
  return patch(`/lips/${lipId}`, {
    data: {json_beneficiary: JSON.stringify(beneficiaries)},
  });
}

export async function updatePaymentData(
  payment: PaymentFormValues,
  lipId: number,
) {
  invalidateTag(Tags.getLip(lipId));
  return patch(`/lips/${lipId}`, {
    data: {json_payment: JSON.stringify(payment)},
  });
}

export async function saveCompanyPrivacyConsent(
  consent: {flags: string[]; options: readonly Option[]},
  lipId: number,
) {
  return post(`/lips/${lipId}/privacy-company`, {
    data: consent,
    tags: [Tags.getLip(lipId)],
  });
}
