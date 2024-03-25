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
  OngoingRelationship,
  PublicOffices,
  publicOfficesOptions,
  TAECode,
  tAECodeOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {lipSchema} from "@/models/entities/lip";
import {privacySchema} from "@/models/entities/privacy";
import {Option, YesNoAnswer, yesNoOptions} from "@/helpers/getOptionsLabel";
import {get, patch, post, postFormData} from "@/services/api";
import {revalidateTag} from "next/cache";

const getLipShape = {
  lip: lipSchema,
};
export async function getLip(id: number) {
  return get(`/lips/${id}`, getLipShape, {tags: ["getLip", `getLip-${id}`]});
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

  return await post(
    "/lips/activate-contractor",
    checkContractorShape,
    JSON.stringify(data),
  );
}

const checkIfFiscalCodeExistsShape = {
  lip: lipSchema.optional(),
};
export async function checkIfFiscalCodeExists(fiscalCode: string) {
  const data = {
    fiscal_code: fiscalCode,
  };

  return await post(
    "/lips/check-contractor",
    checkIfFiscalCodeExistsShape,
    JSON.stringify(data),
  );
}

const lastPrivacyShape = {
  privacy: privacySchema,
};
export async function getLastPrivacy() {
  return get("/last-privacy", lastPrivacyShape);
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
  ongoingRelationship: OngoingRelationship;
  fundSource: FundSource;
  fundSourceOther: string;
}
export async function updateContractorData(
  contractorId: number,
  lipId: number,
  formData: updateContractorDataParams,
) {
  const data = {
    city: formData.residence.place.city,
    province: formData.residence.place.province,
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
      ongoingRelationship: formData.ongoingRelationship,
      fundSource: formData.fundSource,
      fundSourceOther: formData.fundSourceOther,
    }),
  };
  revalidateTag(`getLip-${lipId}`);
  return patch(`/personal-datas/${contractorId}`, {}, JSON.stringify(data));
}

interface UpdateContractorFiscalCodeParams {
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
  revalidateTag(`getLip-${lipId}`);
  return postFormData("/identification-contractor", {}, formData);
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
    expectations: {
      options: expectationsOptions,
      response: formData.expectations,
    },
    duration: {options: durationOptions, response: formData.duration},
  };
  revalidateTag(`getLip-${lipId}`);
  return patch(
    `/lips/${lipId}`,
    {},
    JSON.stringify({json_den: JSON.stringify(data)}),
  );
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
) {
  const data = {
    birthDate: formData.birthDate,
    smoker: formData.smoker,
    death: parseInt(formData.death, 10),
    accidentalDeath: formData.accidentalDeath,
    trafficAccidentalDeath: formData.trafficAccidentalDeath,
    exemptionFromPaying: formData.exemptionFromPaying,
    tpi: {
      enabled: formData.tpi.enabled,
      coverage: parseInt(formData.tpi.coverage, 10),
    },
    cancer: {
      enabled: formData.cancer.enabled,
      coverage: parseInt(formData.cancer.coverage, 10),
    },
    tpd: {
      enabled: formData.tpd.enabled,
      coverage: parseInt(formData.tpd.coverage, 10),
    },
    premium: formData.premium,
  };

  revalidateTag(`getLip-${lipId}`);
  return patch(
    `/lips/${lipId}`,
    {},
    JSON.stringify({json_quotation: JSON.stringify(data)}),
  );
}
export async function updateHealthQuestionnaire(
  formData: HealthQuestionnaireFormValues,
  lipId: number,
) {
  revalidateTag(`getLip-${lipId}`);
  return patch(
    `/lips/${lipId}`,
    {},
    JSON.stringify({json_survey_healthcare: JSON.stringify(formData)}),
  );
}

export async function updateBeneficiaries(
  beneficiaries: BeneficiariesFormValues,
  lipId: number,
) {
  revalidateTag(`getLip-${lipId}`);
  return patch(
    `/lips/${lipId}`,
    {},
    JSON.stringify({json_beneficiary: JSON.stringify(beneficiaries)}),
  );
}

export async function updatePaymentData(
  payment: PaymentFormValues,
  lipId: number,
) {
  revalidateTag(`getLip-${lipId}`);
  return patch(
    `/lips/${lipId}`,
    {},
    JSON.stringify({json_payment: JSON.stringify(payment)}),
  );
}
