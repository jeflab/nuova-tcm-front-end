import {
  fundSourceOptions,
  genderOptions,
  nominationOptions,
  paymentMethodsSimpleOptions,
  relationshipOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {getOptionsValues, yesNoOptions} from "@/helpers/getOptionsLabel";
import {agentSchema} from "@/models/entities/agent";
import {personalDataSchema} from "@/models/entities/personalData";
import {IconStack} from "@/ui/IconStack";
import {
  faCheckCircle,
  faCircleHalf,
  faQuestionCircle,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  faCircle,
  faHandHoldingDollar,
  faSackDollar,
  faUserMd,
} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {z} from "zod";
import {zu} from "zod_utilz";

export const LipStatesIcons: Record<number, ReactNode> = {
  0: <FontAwesomeIcon icon={faQuestionCircle} className="text-primary" />,
  1: <FontAwesomeIcon icon={faCircleHalf} className="text-warning" />,
  2: (
    <IconStack className="text-danger">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon icon={faUserMd} className="fa-stack-1x" />
    </IconStack>
  ),
  3: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
  13: (
    <IconStack className="text-danger">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon icon={faSackDollar} className="fa-stack-1x" />
    </IconStack>
  ),
} as const;

const denSchema = z.object({
  education: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
  educationOther: z.string().optional(),
  job: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
  family: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
  dependentFamilyMembers: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
  otherInsuranceProducts: z.object({
    options: z.array(z.object({value: z.string(), label: z.string()})),
    response: z.string(),
  }),
  needsIntendToMeet: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.array(z.string()),
  }),
  needsIntendToMeetOther: z.string().optional(),
  savings: z.string(),
  income: z.string(),
  economicCondition: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
  fundSource: z.enum(getOptionsValues(fundSourceOptions)),
  fundSourceOther: z.string().optional(),
  expectations: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
  duration: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
});

const quotationSchema = z.object({
  birthDate: z.string(),
  smoker: z.enum(getOptionsValues(yesNoOptions)),
  death: z.number(),
  accidentalDeath: z.boolean(),
  trafficAccidentalDeath: z.boolean(),
  exemptionFromPaying: z.boolean(),
  tpi: z.object({enabled: z.boolean(), coverage: z.coerce.number().catch(0)}),
  cancer: z.object({
    enabled: z.boolean(),
    coverage: z.coerce.number().catch(0),
  }),
  tpd: z.object({enabled: z.boolean(), coverage: z.coerce.number().catch(0)}),
  premium: z.number(),
});

const healthcareQuestionnaireSchema = z.object({
  weight: z.string(),
  height: z.string(),
  IMC: z.coerce.number(),
  hospitalization: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
  }),
  diseases: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
  }),
  drugTherapy: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
  }),
  symptomatology: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
  }),
  professionalRisk: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
  }),
  sportRisk: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
  }),
  cancer: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
  }),
  nervousSystemDiseases: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
  }),
  invalidityPension: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
  }),
  physicalImpairment: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
  }),
});

const beneficiarySchema = z.object({
  name: z.string(),
  surname: z.string(),
  share: z.string(),
  birthDate: z.string(),
  birthPlace: z.object({
    city: z.string(),
    province: z.string(),
  }),
  fiscalCode: z.string(),
  gender: z.enum(getOptionsValues(genderOptions)),
  place: z.object({
    city: z.string(),
    province: z.string(),
  }),
  streetName: z.string(),
  streetNumber: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  email: z.string(),
  pep: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    response: z.enum([...getOptionsValues(relationshipOptions), ""]),
    otherValue: z.string(),
  }),
  relationship: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    response: z.string(),
  }),
});
export type Beneficiary = z.infer<typeof beneficiarySchema>;

const thirdPartySchema = z.object({
  name: z.string(),
  surname: z.string(),
  birthDate: z.string(),
  birthPlace: z.object({
    city: z.string(),
    province: z.string(),
  }),
  fiscalCode: z.string(),
  gender: z.enum(getOptionsValues(genderOptions)),
  place: z.object({
    city: z.string(),
    province: z.string(),
  }),
  streetName: z.string(),
  streetNumber: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  email: z.string(),
});
export type ThirdParty = z.infer<typeof thirdPartySchema>;

const beneficiariesSchema = z.object({
  nomination: z.enum(getOptionsValues(nominationOptions)),
  thirdParty: z.boolean(),
  beneficiaries: z.array(beneficiarySchema).optional(),
  thirdPartyContactPerson: thirdPartySchema.optional(),
});

const paymentSchema = z.object({
  effectiveDate: z.string(),
  duration: z.string(),
  expirationDate: z.string(),
  paymentMethod: z.enum(getOptionsValues(paymentMethodsSimpleOptions)),
  contractorFullName: z.string(),
  jointOwners: z.string().nullish(),
  bank: z.string(),
  bicSwift: z.string(),
  iban: z.string(),
});

export const eSignSchema = z.object({
  identificazione: z
    .record(
      z.enum(["esign_agente"]),
      z.object({
        file: z.string(),
        esign_id: z.number(),
        data: z.string(),
      }),
    )
    .optional(),
  polizza: z
    .record(
      z.enum(["esign_agente", "esign_contraente", "esign_contraente_sepa"]),
      z.object({
        file: z.string(),
        esign_id: z.number(),
        data: z.string(),
      }),
    )
    .optional(),
  allegato4: z.any().optional(),
  setInformativo: z.any().optional(),
});

const amlSchema = z.object({
  // id: z.number(),
  blocked: z.boolean(),
  // version: z.string(),
  // lip_id: z.number(),
  // contractor_id: z.number(),
  // rating: z.array(z.union([z.number(), z.string()])),
  // note: z.string(),
});

const privacyCompanySchema = z.array(
  z.object({
    flags: z.array(z.string()),
    options: z.array(z.object({label: z.string(), value: z.string()})),
    data: z.string(),
  }),
);

const lipStateSchema = z
  .object({
    id: z.number(),
    label: z.string(),
  })
  .default({id: 1, label: "Incompleta"});

export const lipSchema = z
  .object({
    id: z.number(),
    insured_id: z.number(),
    created_at: z.coerce.date(),
    agent: agentSchema,
    contractor: personalDataSchema,
    lip_number: z.coerce.string(),
    json_den: zu.stringToJSON().pipe(denSchema).nullish(),
    json_quotation: zu.stringToJSON().pipe(quotationSchema).nullish(),
    json_survey_healthcare: zu
      .stringToJSON()
      .pipe(healthcareQuestionnaireSchema)
      .nullish(),
    json_beneficiary: zu.stringToJSON().pipe(beneficiariesSchema).nullish(),
    json_payment: zu.stringToJSON().pipe(paymentSchema).nullish(),
    json_esign: zu.stringToJSON().pipe(eSignSchema).nullish(),
    aml: amlSchema.nullish(),
    json_privacy_company: zu
      .stringToJSON()
      .pipe(privacyCompanySchema)
      .nullish(),
    lipstates: z.array(lipStateSchema).transform((states) => {
      return states?.[states.length - 1] ?? lipStateSchema._def.defaultValue();
    }),
  })
  .transform(
    ({
      created_at,
      insured_id,
      lip_number,
      json_den,
      json_quotation,
      json_survey_healthcare,
      json_beneficiary,
      json_payment,
      json_esign,
      json_privacy_company,
      lipstates,
      ...data
    }) => {
      return {
        ...data,
        createdAt: created_at,
        insuredId: insured_id,
        lipNumber: lip_number,
        den: json_den,
        quotation: json_quotation,
        healthcareQuestionnaire: json_survey_healthcare,
        beneficiaries: json_beneficiary,
        payment: json_payment,
        eSigns: json_esign,
        privacyCompany: json_privacy_company,
        lipStates: lipstates,
      };
    },
  );
export type Lip = z.infer<typeof lipSchema>;
