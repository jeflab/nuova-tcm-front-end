import {
  ComplementaryCoverageKey,
  complementaryCoverages,
} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {
  fundSourceOptions,
  genderOptions,
  idTypeOptions,
  lipTypeOptions,
  nominationOptions,
  paymentMethodsSimpleOptions,
  relationshipOptions,
  sportRiskIndexOptions,
  yesNoOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {getOptionsValues} from "@/helpers/getOptionsLabel";
import {agentSchema} from "@/models/entities/agent";
import {personalDataSchema} from "@/models/entities/personalData";
import {IconStack} from "@/ui/IconStack";
import {
  faCheckCircle,
  faCircleEuro,
  faCircleHalf,
  faCircleXmark,
  faQuestionCircle,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  faCircle,
  faHeartPulse,
  faPaperPlane,
  faSackDollar,
  faStar,
} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {z} from "zod";
import {zu} from "zod_utilz";

const LipStatesIcons: Record<number, ReactNode> = {
  // 0: Sconosciuto
  0: <FontAwesomeIcon icon={faQuestionCircle} className="text-primary" />,
  // 1: Incompleta
  1: <FontAwesomeIcon icon={faCircleHalf} className="text-primary" />,
  // 2: Underwriting sanitario
  2: (
    <IconStack className="text-warning">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon icon={faHeartPulse} className="fa-stack-1x" />
    </IconStack>
  ),
  // 3: Completa
  3: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
  // 4: Approvata dal broker
  4: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
  // 5: Primo pagamento confermato
  5: <FontAwesomeIcon icon={faCircleEuro} className="text-success" />,
  // 6: Approvazione dal MasterBroker
  6: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
  // 7: Inviata in compagnia
  7: (
    <IconStack className="text-success">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon
        icon={faPaperPlane}
        className="fa-stack-1x"
        transform="left-1"
      />
    </IconStack>
  ),
  // 8: Rifiutata
  8: <FontAwesomeIcon icon={faCircleXmark} className="text-danger" />,
  // 9: Accettata
  9: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
  // 10: Non approvata dal broker
  10: <FontAwesomeIcon icon={faCircleXmark} className="text-danger" />,
  // 11: Non approvata dal Master Broker a livello finanziario
  11: <FontAwesomeIcon icon={faCircleEuro} className="text-danger" />,
  // 12: Non approvata dal Master Broker a livello qualitativo
  12: (
    <IconStack className="text-danger">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon icon={faStar} className="fa-stack-1x" />
    </IconStack>
  ),
  // 13: Bloccata per AML
  13: (
    <IconStack className="text-danger">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon icon={faSackDollar} className="fa-stack-1x" />
    </IconStack>
  ),
  // 14: Approvata dopo revisione underwriting sanitario
  14: (
    <IconStack className="text-primary">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon icon={faHeartPulse} className="fa-stack-1x" />
    </IconStack>
  ),
  // 15: Non approvata dopo revisione underwriting sanitario
  15: (
    <IconStack className="text-danger">
      <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" opacity={0.4} />
      <FontAwesomeIcon icon={faHeartPulse} className="fa-stack-1x" />
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
export type Den = z.infer<typeof denSchema>;

const underwritingSchema = z
  .object({
    extra_premium: z.object({value: z.number(), note: z.string()}),
    exclusions: z.array(
      z
        .object({
          name: z.enum(
            Object.keys(complementaryCoverages) as [
              ComplementaryCoverageKey,
              ...ComplementaryCoverageKey[],
            ],
          ),
          decline: z.boolean(),
          exclusion: z.string(),
          reason_of_loading: z.string(),
          comment: z.string(),
        })
        .transform(({reason_of_loading, ...data}) => ({
          ...data,
          reasonOfLoading: reason_of_loading,
        })),
    ),
  })
  .transform(({extra_premium, ...data}) => ({
    ...data,
    extraPremium: extra_premium,
  }));
export type Underwriting = z.infer<typeof underwritingSchema>;

const quotationSchema = z
  .object({
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
    underwriting: underwritingSchema.nullish(),
    not_approve_underwriting: z.string().nullish(),
  })
  .transform(({not_approve_underwriting, ...data}) => ({
    ...data,
    notApproveUnderwriting: not_approve_underwriting,
  }));

const healthcareQuestionnaireSchema = z.object({
  weight: z.string(),
  height: z.string(),
  IMC: z.coerce.number(),
  hospitalization: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string().nullish(),
  }),
  diseases: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string().nullish(),
  }),
  drugTherapy: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string().nullish(),
  }),
  symptomatology: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string().nullish(),
  }),
  professionalRisk: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    details: z.string().nullish(),
  }),
  sportRisk: z.object({
    check: z.enum(getOptionsValues(yesNoOptions)),
    sport: z
      .array(
        z.object({
          name: z.string(),
          riskIndex: z.enum(getOptionsValues(sportRiskIndexOptions)),
        }),
      )
      .nullish(),
  }),
  cancer: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string().nullish(),
  }),
  nervousSystemDiseases: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string().nullish(),
  }),
  invalidityPension: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string().nullish(),
  }),
  physicalImpairment: z.object({
    check: z.enum([...getOptionsValues(yesNoOptions), ""]),
    details: z.string().nullish(),
  }),
});
export type HealthcareQuestionnaire = z.infer<
  typeof healthcareQuestionnaireSchema
>;

const identityDocumentSchema = z.object({
  idType: z.enum(getOptionsValues(idTypeOptions)),
  number: z.string(),
  issuedBy: z.string(),
  issuedByOrg: z.string(),
  issuedDate: z.coerce.date(),
  expiringDate: z.coerce.date(),
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
  identityDocument: identityDocumentSchema.optional(),
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
  identityDocument: identityDocumentSchema.optional(),
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
  identificazione_assicurato: z
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
      z.enum([
        "esign_agente",
        "esign_contraente",
        "esign_contraente_sepa",
        "esign_contraente_underwriting",
        "esign_assicurato",
      ]),
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

export const lipStateSchema = z
  .object({
    id: z.number(),
    label: z.string(),
  })
  .default({id: 0, label: "Sconosciuto"})
  .transform(({id, label}) => ({
    id,
    label,
    icon: LipStatesIcons[id] ?? LipStatesIcons[0],
  }));
export type LipState = z.infer<typeof lipStateSchema>;

const certificateSchema = z
  .object({effective_date: z.coerce.date()})
  .transform(({effective_date}) => ({
    effectiveDate: effective_date,
  }));

export const lipSchema = z
  .object({
    id: z.number(),
    created_at: z.coerce.date(),
    agent: agentSchema,
    contractor: personalDataSchema,
    contractor_insured_relationship: z.string().nullish(),
    insured: personalDataSchema.nullish(),
    lip_number: z.coerce.string(),
    json_den: zu.stringToJSON().pipe(denSchema).nullish(),
    json_quotation: zu.stringToJSON().pipe(quotationSchema).nullish(),
    json_survey_healthcare: zu
      .stringToJSON()
      .pipe(healthcareQuestionnaireSchema)
      .nullish(),
    must_ask_underwriting: z.boolean(),
    json_beneficiary: zu.stringToJSON().pipe(beneficiariesSchema).nullish(),
    json_payment: zu.stringToJSON().pipe(paymentSchema).nullish(),
    json_certificate: zu.stringToJSON().pipe(certificateSchema).nullish(),
    json_esign: zu.stringToJSON().pipe(eSignSchema).nullish(),
    aml: amlSchema.nullish(),
    json_privacy_company: zu
      .stringToJSON()
      .pipe(privacyCompanySchema)
      .nullish(),
    lipstates: z
      .array(lipStateSchema)
      .nullish()
      .transform((states) => {
        return states?.[states.length - 1] ?? lipStateSchema.parse(undefined);
      }),
    type: z.enum(getOptionsValues(lipTypeOptions)),
  })
  .transform(
    ({
      created_at,
      lip_number,
      contractor_insured_relationship,
      json_den,
      json_quotation,
      json_survey_healthcare,
      must_ask_underwriting,
      json_beneficiary,
      json_payment,
      json_certificate,
      json_esign,
      json_privacy_company,
      lipstates,
      ...data
    }) => {
      const contractorInsuredRelationship =
        contractor_insured_relationship?.startsWith("other:")
          ? contractor_insured_relationship.slice(0, 5)
          : contractor_insured_relationship;
      const contractorInsuredRelationshipOther =
        contractor_insured_relationship?.startsWith("other:")
          ? contractor_insured_relationship.slice(6)
          : undefined;
      return {
        ...data,
        createdAt: created_at,
        lipNumber: lip_number,
        contractorInsuredRelationship,
        contractorInsuredRelationshipOther,
        den: json_den,
        quotation: json_quotation,
        healthcareQuestionnaire: json_survey_healthcare,
        mustAskUnderwriting: must_ask_underwriting,
        beneficiaries: json_beneficiary,
        payment: json_payment,
        certificate: json_certificate,
        eSigns: json_esign,
        privacyCompany: json_privacy_company,
        lipStates: lipstates,
      };
    },
  );
export type Lip = z.infer<typeof lipSchema>;
