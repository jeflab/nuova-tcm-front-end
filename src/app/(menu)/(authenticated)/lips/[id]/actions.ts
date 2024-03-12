"use server";

import {ContractorGender} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorFiscalCodeForm";
import {fatcaQuestions} from "@/app/(menu)/(authenticated)/lips/[id]/FatcaForm";
import {
  FundSource,
  JobPosition,
  jobPositionOptions,
  PublicOffices,
  publicOfficesOptions,
  TAECode,
  tAECodeOptions,
} from "@/app/(menu)/(authenticated)/lips/[id]/selectsOptions";
import {lipSchema} from "@/entities/lip";
import {personalDataSchema} from "@/entities/personalData";
import {privacySchema} from "@/entities/privacy";
import {Option, YesNoAnswer, yesNoOptions} from "@/helpers/getOptionsLabel";
import {get, patch, post, put} from "@/services/api";
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
  gender: ContractorGender;
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
  contractor: personalDataSchema.optional(),
};
export async function checkIfFiscalCodeExists(fiscalCode: string) {
  const data = {
    fiscal_code: fiscalCode,
  };

  return await post(
    "/lips/check-contractor",
    checkContractorShape,
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
      fundSource: formData.fundSource,
      fundSourceOther: formData.fundSourceOther,
    }),
  };
  revalidateTag(`getLip-${lipId}`);
  return patch(`/personal-datas/${contractorId}`, {}, JSON.stringify(data));
}
