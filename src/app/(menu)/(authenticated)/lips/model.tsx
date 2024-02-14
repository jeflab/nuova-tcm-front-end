import {
  PepPerson,
  PepRelation,
} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorDataForm";
import {ContractorGender} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorFiscalCodeForm";
import {
  DependentFamilyMembersOptions,
  DurationOptions,
  EconomicConditionOptions,
  EducationOptions,
  ExpectationsOptions,
  FamilyOptions,
  JobOptions,
  NeedsToMeetOptions,
} from "@/app/(menu)/(authenticated)/lips/[id]/DenForm";
import {IdType} from "@/app/(menu)/(authenticated)/lips/[id]/IdentificationForm";
import {YesNoAnswer} from "@/helpers/TypesHelper";
import {
  faCheckCircle,
  faCircleHalf,
  faDollarCircle,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {z} from "zod";

export const lipStates = ["open", "payment_pending", "complete"] as const;
export type LipStatesKeys = (typeof lipStates)[number];

export const lipSchema = z.object({
  id: z.number(),
  surname: z.string(),
  name: z.string(),
  date: z.coerce.date(),
  state: z.enum(lipStates),
});

export type Lip = z.infer<typeof lipSchema>;

export const lipStatesLabels: Record<LipStatesKeys, string> = {
  open: "Aperta",
  payment_pending: "In attesa di pagamento",
  complete: "Completata",
} as const;

export const LipStatesIcons: Record<LipStatesKeys, ReactNode> = {
  open: <FontAwesomeIcon icon={faCircleHalf} className="text-warning" />,
  payment_pending: (
    <FontAwesomeIcon icon={faDollarCircle} className="text-warning" />
  ),
  complete: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
} as const;

export type Pep =
  | {
      isPep: "yes";
      person: PepPerson;
      relation: PepRelation;
    }
  | {
      isPep: "no";
      person: "";
      relation: "";
    };

// TODO: sistemare interfaccia
export interface TempLipData {
  agentId?: number;
  fatca?: boolean;
  contractorFiscalCode?: {
    birthDate: string;
    birthPlace: {
      city: string;
      province: string;
    };
    fiscalCode: string;
    gender: ContractorGender;
    name: string;
    surname: string;
  };
  contractorPersonalAreaActivation?: boolean;
  contractorData?: {
    contractorPersonalData: {
      birthDate: string;
      birthPlace: {
        city: string;
        province: string;
      };
      fiscalCode: string;
      gender: ContractorGender;
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
    pep: Pep;
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
  den?: {
    education: EducationOptions;
    job: JobOptions;
    family: FamilyOptions;
    dependentFamilyMembers: DependentFamilyMembersOptions;
    otherInsuranceProducts: YesNoAnswer;
    needsIntendToMeet: NeedsToMeetOptions[];
    savings: string;
    economicCondition: EconomicConditionOptions;
    expectations: ExpectationsOptions[];
    duration: DurationOptions;
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
}
