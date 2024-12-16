"use server";

import {BeneficiariesFormValues} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/BeneficiariesForm";
import {HealthQuestionnaireFormValues} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/HealthQuestionnaireForm";
import {PaymentFormValues} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentForm";
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
  LipType,
  needsToMeetOptions,
  NeedsToMeetOptions,
  PublicOffices,
  publicOfficesOptions,
  TAECode,
  tAECodeOptions,
  YesNoAnswer,
  yesNoOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {Option} from "@/helpers/getOptionsLabel";
import {
  getTypedFormDataFromObject,
  TypedFormData,
} from "@/helpers/typedFormData";
import {lipSchema} from "@/models/entities/lip";
import {privacySchema} from "@/models/entities/privacy";
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
  type: LipType;
  fatca: {
    label: string;
    text: string;
    options: readonly Option[];
    response: YesNoAnswer;
  };
  italianResidency: {
    label: string;
    text: string;
    options: readonly Option[];
    response: YesNoAnswer;
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
    type: contractorData.type,
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

export async function updateUnderwriting(lipId: number) {
  return patch(`/lips/${lipId}/underwriting`, {
    tags: [Tags.getLip(lipId)],
  });
}

interface UpdatePersonalDataParams {
  insuredPersonalData?: {
    birthDate: string;
    birthPlace: {
      city: string;
      province: string;
    };
    fiscalCode: string;
    gender: Gender;
    name: string;
    surname: string;
  };

  citizenship: string;
  secondCitizenship: string;
  residence: {
    place: {
      city: string;
      province: string;
    };
    streetName: string;
    streetNumber: string;
    zipCode: string;
  };
  pep?: {
    isPep: YesNoAnswer;
    publicOffice: PublicOffices;
    otherPep: YesNoAnswer;
  };
  job?: {
    position: JobPosition;
    positionOther: string;
    tAECode: "" | TAECode;
    type: string;
    province: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  relationship?: string;
  relationshipOther?: string;
}
export async function updatePersonalData(
  personalDataId: number,
  lipId: number,
  formData: UpdatePersonalDataParams,
) {
  const data = {
    ...(formData.insuredPersonalData && {
      name: formData.insuredPersonalData.name,
      surname: formData.insuredPersonalData.surname,
      gender: formData.insuredPersonalData.gender,
      date_birth: formData.insuredPersonalData.birthDate,
      place_birth:
        formData.insuredPersonalData.birthPlace.province !== "EE"
          ? formData.insuredPersonalData.birthPlace.city
          : "Estero",
      region_birth: formData.insuredPersonalData.birthPlace.province,
      country_birth:
        formData.insuredPersonalData.birthPlace.province !== "EE"
          ? "Italia"
          : formData.insuredPersonalData.birthPlace.city,
      fiscal_code: formData.insuredPersonalData.fiscalCode,
    }),

    city: formData.residence.place.city,
    region: formData.residence.place.province,
    address: formData.residence.streetName,
    street_number: formData.residence.streetNumber,
    zip_code: formData.residence.zipCode,
    citizenship: formData.citizenship,
    second_citizenship: formData.secondCitizenship,
    json_pep:
      formData.pep && formData.job
        ? JSON.stringify({
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
              ...(["entrepreneur", "freelancer", "selfEmployed"].includes(
                formData.job.position,
              ) && {
                tAECode: {
                  options: tAECodeOptions,
                  response: formData.job.tAECode,
                },
              }),
              ...(["employee", "manager"].includes(formData.job.position) && {
                type: formData.job.type,
              }),
              province: formData.job.province,
              country: formData.job.country,
            },
          })
        : undefined,
    email: formData.contact.email,
    phone: formData.contact.phone,
    lipRelationship:
      formData.relationship === "other"
        ? "other:" + formData.relationshipOther
        : formData.relationship,
  };

  return patch(`/personal-datas/${personalDataId}`, {
    data,
    tags: [Tags.getLip(lipId)],
  });
}

interface AddInsuredDataParams {
  citizenship: string;
  secondCitizenship: string;
  insuredPersonalData: {
    birthDate: string;
    birthPlace: {
      city: string;
      province: string;
    };
    fiscalCode: string;
    gender: Gender;
    name: string;
    surname: string;
  };
  residence: {
    place: {
      city: string;
      province: string;
    };
    streetName: string;
    streetNumber: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  relationship: string;
  relationshipOther: string;
}
export async function addInsuredData(
  lipId: number,
  formData: AddInsuredDataParams,
) {
  const data = {
    name: formData.insuredPersonalData.name,
    surname: formData.insuredPersonalData.surname,
    gender: formData.insuredPersonalData.gender,
    date_birth: formData.insuredPersonalData.birthDate,
    place_birth:
      formData.insuredPersonalData.birthPlace.province !== "EE"
        ? formData.insuredPersonalData.birthPlace.city
        : "Estero",
    region_birth: formData.insuredPersonalData.birthPlace.province,
    country_birth:
      formData.insuredPersonalData.birthPlace.province !== "EE"
        ? "Italia"
        : formData.insuredPersonalData.birthPlace.city,
    fiscal_code: formData.insuredPersonalData.fiscalCode,
    address: formData.residence.streetName,
    street_number: formData.residence.streetNumber,
    city: formData.residence.place.city,
    zip_code: formData.residence.zipCode,
    region: formData.residence.place.province,
    citizenship: formData.citizenship,
    second_citizenship: formData.secondCitizenship,
    email: formData.contact.email,
    phone: formData.contact.phone,
    lipRelationship:
      formData.relationship === "other"
        ? "other:" + formData.relationshipOther
        : formData.relationship,
  };

  return post(`/lips/${lipId}/addInsured`, {
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
}
export async function identificationContractor(
  documentFormData: TypedFormData<IdentificationContractorParams>,
  fiscalCode: string,
  lipId: number,
) {
  const formData = getTypedFormDataFromObject({
    idFront: documentFormData.get("frontPicture"),
    idBack: documentFormData.get("backPicture"),
    type: documentFormData.get("idType"),
    number: documentFormData.get("number"),
    issued_by: documentFormData.get("issuedBy"),
    issued_by_org: documentFormData.get("issuedByOrg"),
    issuing_date: documentFormData.get("issuedDate"),
    expiring_date: documentFormData.get("expiringDate"),
    fiscal_code: fiscalCode,
  });
  return post("/identification-contractor", {
    data: formData,
    tags: [Tags.getLip(lipId)],
  });
}

interface UpdateDenParams {
  education: EducationOptions;
  educationOther: string;
  job: JobPosition;
  family: FamilyOptions;
  dependentFamilyMembers: DependentFamilyMembersOptions;
  otherInsuranceProducts: YesNoAnswer;
  needsIntendToMeet: NeedsToMeetOptions[];
  needsIntendToMeetOther: string;
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
    educationOther: formData.educationOther,
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
    needsIntendToMeetOther: formData.needsIntendToMeetOther,
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
  originalPremium: number;
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
    premium: Math.round(formData.premium * 100) / 100,
    originalPremium: formData.originalPremium,
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
