import {
  Gender,
  YesNoAnswer,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";

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
