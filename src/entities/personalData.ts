import {Prettify} from "@/helpers/TypesHelper";
import {z} from "zod";
import {zu} from "zod_utilz";

const factaSchema = z.object({
  fatcaCheck: z.object({
    label: z.string(),
    text: z.string(),
    options: z.array(z.object({label: z.string(), value: z.string()})),
    response: z.string(),
  }),
});

export const personalDataSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    surname: z.string(),
    email: z.string(),
    phone: z.string(),
    date_birth: z.coerce.date(),
    place_birth: z.string(),
    region_birth: z.string(),
    fiscal_code: z.string(),
    gender: z.enum(["male", "female", "other"]),
    last_privacy_esign_id: z.number().nullable(),
    json_fatca: zu.stringToJSON().pipe(factaSchema),
  })
  .transform(
    ({
      date_birth,
      place_birth,
      fiscal_code,
      last_privacy_esign_id,
      json_fatca,
      ...data
    }) => {
      return {
        ...data,
        birthDate: date_birth,
        birthPlace: place_birth,
        fiscalCode: fiscal_code,
        lastPrivacyEsignId: last_privacy_esign_id,
        fatca: json_fatca,
      };
    },
  );
export type PersonalData = Prettify<z.infer<typeof personalDataSchema>>;

/**************************************************************/

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
