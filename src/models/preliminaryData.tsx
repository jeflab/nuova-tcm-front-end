import {Gender} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {YesNoAnswer} from "@/helpers/getOptionsLabel";

export interface PreliminaryData {
  fatca?: YesNoAnswer;
  italianResidency?: YesNoAnswer;
  contractorAlreadyRegistered?: boolean;
  contractorPersonalData?: {
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
}
