import {z} from "zod";

export const agentSchema = z.object({
  name: z.string(),
  surname: z.string(),
});
export type Agent = z.infer<typeof agentSchema>;

export const contractorSchema = z.object({
  name: z.string(),
  surname: z.string(),
});
export type Contractor = z.infer<typeof contractorSchema>;

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

export const agentSchemaFromTransform = z.object({
  id: z.number(),
  user_id: z.number(),
  broker_id: z.number(),
  name: z.string(),
  surname: z.string(),
  address: z.string(),
  street_number: z.string(),
  city: z.string(),
  zip_code: z.string(),
  region: z.string(),
  rui_code: z.string(),
  rui_date: z.string(),
  vat_number: z.string(),
  company_name: z.string(),
  company_rui_code: z.string(),
  company_rui_date: z.string(),
  company_vat_number: z.string(),
  company_fiscal_code: z.string(),
  company_position: z.string(),
  company_registered_office: z.string(),
  company_web_site: z.string(),
  company_email: z.string(),
  company_pec: z.string(),
  status: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.null(),
});

export const contractorSchemaFromTransform = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  surname: z.string(),
  gender: z.null(),
  date_birth: z.null(),
  place_birth: z.null(),
  country_birth: z.null(),
  fiscal_code: z.string(),
  address: z.null(),
  street_number: z.null(),
  city: z.null(),
  zip_code: z.null(),
  region: z.null(),
  citizenship: z.null(),
  email: z.string(),
  phone: z.string(),
  json_fatca: z.null(),
  json_pep: z.null(),
  json_privacy: z.null(),
  privacy_id: z.null(),
  last_privacy_esign_id: z.null(),
  status: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.null(),
});
