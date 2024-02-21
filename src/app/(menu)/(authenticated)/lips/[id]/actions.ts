"use server";

import {ContractorGender} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorFiscalCodeForm";
import {fatcaQuestions} from "@/app/(menu)/(authenticated)/lips/[id]/FatcaForm";
import {contractorSchema} from "@/entities/contractor";
import {lipSchema} from "@/entities/lip";
import {Option, YesNoAnswer} from "@/helpers/TypesHelper";
import {post} from "@/services/api";

const checkContractorShape = {
  lip: lipSchema.optional(),
  contractor: contractorSchema.optional(),
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
    region: contractorData.birthPlace.province,
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
  contractor: contractorSchema.optional(),
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
