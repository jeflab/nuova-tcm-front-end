import {z} from "zod";

export const agentSchema = z.object({
  name: z.string(),
  surname: z.string(),
});
export type Agent = z.infer<typeof agentSchema>;

/**************************************************************/

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
