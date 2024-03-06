import {agentSchema} from "@/entities/agent";
import {personalDataSchema} from "@/entities/personalData";
import {faCircleHalf, faCircleTrash} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {z} from "zod";

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

export const lipSchema = z
  .object({
    id: z.number(),
    insured_id: z.number(),
    created_at: z.coerce.date(),
    agent: agentSchema,
    contractor: personalDataSchema,
    lip_number: z.coerce.string(),
    status: z.union([z.literal(0), z.literal(1)]).transform((status) => {
      return lipStatuses[status];
    }),
  })
  .transform(({created_at, insured_id, lip_number, ...data}) => {
    return {
      ...data,
      createdAt: created_at,
      insuredId: insured_id,
      lipNumber: lip_number,
    };
  });
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
