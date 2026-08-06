import {
  Gender,
  YesNoAnswer,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {Lip} from "@/models/entities/lip";

export interface PreliminaryData {
  type?: Lip["type"];
  salesMode?: Lip["salesMode"];
  contractorInsuredRelationship?: Lip["contractorInsuredRelationship"];
  contractorInsuredRelationshipOther?: Lip["contractorInsuredRelationshipOther"];
  contractor?: {
    fatca: {
      fatcaCheck: {response: YesNoAnswer};
      residencyCheck: {response: YesNoAnswer};
    };
    birthDate?: Date;
    birthPlace?: string;
    birthProvince?: string;
    fiscalCode?: string;
    gender?: Gender;
    name?: string;
    surname?: string;
  };
  insured?: {
    fatca: {
      fatcaCheck: {response: YesNoAnswer};
      residencyCheck: {response: YesNoAnswer};
    };
  };
  contractorAlreadyRegistered?: boolean;
}
