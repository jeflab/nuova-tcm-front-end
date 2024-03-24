import {
  Gender,
  IdType,
  PaymentMethodsSimple,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {Documents} from "@/entities/document";
import {YesNoAnswer} from "@/helpers/getOptionsLabel";

// TODO: sistemare interfaccia
export interface TempLipData {
  agentId?: number;
  contractorPersonalAreaActivation?: boolean;
  contractorData?: {
    contractorPersonalData: {
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
    contact: {
      phone: string;
      email: string;
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
    aml: {
      job: string;
      sector: string;
      netIncome: string;
      fundSource: string;
    };
  };
  identification?: {
    idType: IdType;
    number: string;
    issuedBy: string;
    issuedDate: string;
    expiringDate: string;
    frontPicture: string;
    backPicture: string;
    metContractorInPerson: boolean;
    documentIsCopyShownByContractor: boolean;
    photoIsOfContractor: boolean;
    contractorHasBeenIdentified: boolean;
  };
  idPictures?: {
    frontPictureUrl?: string; // Temp
    backPictureUrl?: string; // Temp
  };
  quote?: {
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
  };
  healthQuestionnaire?: {
    weight: string;
    height: string;
    hospitalization: YesNoAnswer;
    diseases: YesNoAnswer;
    drugTherapy: YesNoAnswer;
    symptomatology: YesNoAnswer;
    professionalRisk: YesNoAnswer;
    sportRisk: YesNoAnswer;
    cancer?: YesNoAnswer;
    nervousSystemDiseases?: YesNoAnswer;
    invalidityPension?: YesNoAnswer;
    physicalImpairment?: YesNoAnswer;
  };
  beneficiaries?: (
    | {
        nomination: "heirs";
      }
    | {
        nomination: "beneficiaries";
        beneficiaries: {
          surname: string;
          name: string;
          birthDate: string;
          birthPlace: {city: string; province: string};
          fiscalCode: string;
          streetName: string;
          streetNumber: string;
          place: {city: string; province: string};
          zipCode: string;
          phone: string;
          email: string;
          share: string;
        }[];
      }
  ) &
    (
      | {thirdParty: false}
      | {
          thirdParty: true;
          thirdPartyContactPerson: {
            name: string;
            surname: string;
            birthDate: string;
            birthPlace: {city: string; province: string};
            fiscalCode: string;
            place: {
              city: string;
              province: string;
            };
            streetName: string;
            streetNumber: string;
            zipCode: string;
            phone: string;
            email: string;
          };
        }
    );
  documentation?: Documents;
  payment?: {
    bank: string;
    iban: string;
    paymentMethod: PaymentMethodsSimple;
  };
}

export interface PreliminaryData {
  fatca?: YesNoAnswer;
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
