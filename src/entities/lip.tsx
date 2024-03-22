import {
  gendersOptions,
  nominationOptions,
  paymentMethodsSimpleOptions,
  relationshipOptions,
} from "@/app/(menu)/(authenticated)/lips/[id]/selectsOptions";
import {agentSchema} from "@/entities/agent";
import {personalDataSchema} from "@/entities/personalData";
import {getOptionsValues, yesNoOptions} from "@/helpers/getOptionsLabel";
import {faCircleHalf, faCircleTrash} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {z} from "zod";
import {zu} from "zod_utilz";

export const lipStatuses = ["softDeleted", "open"] as const;
export type LipStatesKeys = (typeof lipStatuses)[number];

export const lipStatusesLabels: Record<LipStatesKeys, string> = {
  softDeleted: "Eliminata",
  open: "Aperta",
} as const;
export const LipStatusesIcons: Record<LipStatesKeys, ReactNode> = {
  softDeleted: <FontAwesomeIcon icon={faCircleTrash} className="text-danger" />,
  open: <FontAwesomeIcon icon={faCircleHalf} className="text-warning" />,
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
  expectations: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.array(z.string()),
  }),
  duration: z.object({
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
});

const quotationSchema = z.object({
  birthDate: z.string(),
  smoker: z.string(),
  death: z.number(),
  accidentalDeath: z.boolean(),
  trafficAccidentalDeath: z.boolean(),
  exemptionFromPaying: z.boolean(),
  tpi: z.object({enabled: z.boolean(), coverage: z.number()}),
  cancer: z.object({enabled: z.boolean(), coverage: z.number()}),
  tpd: z.object({enabled: z.boolean(), coverage: z.number()}),
  premium: z.number(),
});

const healthcareQuestionnaireSchema = z.object({
  weight: z.string(),
  height: z.string(),
  hospitalization: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string(),
  }),
  diseases: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string(),
  }),
  drugTherapy: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string(),
  }),
  symptomatology: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string(),
  }),
  professionalRisk: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string(),
  }),
  sportRisk: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string(),
  }),
  cancer: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string(),
  }),
  nervousSystemDiseases: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string(),
  }),
  invalidityPension: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string(),
  }),
  physicalImpairment: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string(),
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
  gender: z.enum(getOptionsValues(gendersOptions)),
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
    response: z.enum([...getOptionsValues(relationshipOptions), ""]),
  }),
});

const thirdPartySchema = z.object({
  name: z.string(),
  surname: z.string(),
  birthDate: z.string(),
  birthPlace: z.object({
    city: z.string(),
    province: z.string(),
  }),
  fiscalCode: z.string(),
  gender: z.enum(getOptionsValues(gendersOptions)),
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
  medicalExam: z.enum(getOptionsValues(yesNoOptions)),
  paymentMethod: z.enum(getOptionsValues(paymentMethodsSimpleOptions)),
  contractorFullName: z.string(),
  bank: z.string(),
  bicSwift: z.string(),
  iban: z.string(),
});

export const eSignSchema = z.object({
  identificazione: z
    .object({
      file: z.string(),
      esign_id: z.number(),
      data: z.string(),
    })
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
});

export const lipSchema = z
  .object({
    id: z.number(),
    insured_id: z.number(),
    created_at: z.coerce.date(),
    agent: agentSchema,
    contractor: personalDataSchema,
    lip_number: z.coerce.string(),
    json_den: zu.stringToJSON().pipe(denSchema).nullable().optional(),
    json_quotation: zu
      .stringToJSON()
      .pipe(quotationSchema)
      .nullable()
      .optional(),
    json_survey_healthcare: zu
      .stringToJSON()
      .pipe(healthcareQuestionnaireSchema)
      .nullable()
      .optional(),
    json_beneficiary: zu
      .stringToJSON()
      .pipe(beneficiariesSchema)
      .nullable()
      .optional(),
    json_payment: zu.stringToJSON().pipe(paymentSchema).nullable().optional(),
    json_esign: zu.stringToJSON().pipe(eSignSchema).nullable().optional(),
    status: z.union([z.literal(0), z.literal(1)]).transform((status) => {
      return lipStatuses[status];
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
      };
    },
  );
export type Lip = z.infer<typeof lipSchema>;

/**************************************************************/

export const lipSchemaFromTransform = z.object({
  lips: z.array(
    z.array(
      z.object({
        id: z.number(),
        agent_id: z.number(),
        personal_data_id: z.number(),
        insured_id: z.number(),
        executor_id: z.null(),
        json_beneficiary: z.string(),
        height: z.number(),
        weight: z.number(),
        bmi: z.number(),
        smoker: z.number(),
        death_coverage: z.number(),
        accidental_death_coverage: z.number(),
        traffic_accidental_death_coverage: z.number(),
        tpd_coverage: z.number(),
        ltc_coverage: z.number(),
        cancer_coverage: z.number(),
        json_calculation_parameters: z.string(),
        json_calculation_results: z.string(),
        date_start: z.string(),
        duration: z.number(),
        date_end: z.string(),
        date_den: z.string(),
        json_den: z.string(),
        date_quotation: z.string(),
        json_quotation: z.string(),
        date_survey_healthcare: z.string(),
        json_survey_healthcare: z.string(),
        json_documents: z.string(),
        json_identifications: z.string(),
        json_payment: z.string(),
        json_esign: z.string(),
        payment_status: z.number(),
        status: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
        deleted_at: z.null(),
      }),
    ),
  ),
});
