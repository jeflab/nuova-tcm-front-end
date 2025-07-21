import {
  Gender,
  LipSalesMode,
  LipType,
  YesNoAnswer,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";

export interface PreliminaryData {
  type?: LipType;
  salesMode?: LipSalesMode;
  fatca?: YesNoAnswer;
  insuredFatca?: YesNoAnswer;
  italianResidency?: YesNoAnswer;
  insuredItalianResidency?: YesNoAnswer;
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
