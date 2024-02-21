import {agentSchema} from "@/entities/agent";
import {z} from "zod";

export const lipSchema = z
  .object({
    id: z.number(),
    contractor_id: z.number(),
    insured_id: z.number(),
    created_at: z.coerce.date(),
    agent: agentSchema,
  })
  .transform(({created_at, contractor_id, insured_id, ...data}) => {
    return {
      ...data,
      createdAt: created_at,
      contractorId: contractor_id,
      insuredId: insured_id,
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
