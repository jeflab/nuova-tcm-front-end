import {
  jobPositionOptions,
  publicOfficesOptions,
  tAECodeOptions,
} from "@/app/(menu)/(authenticated)/lips/[id]/selectsOptions";
import {getOptionsValues, yesNoOptions} from "@/helpers/getOptionsLabel";
import {Prettify} from "@/helpers/TypesHelper";
import {z} from "zod";
import {zu} from "zod_utilz";

const factaSchema = z.object({
  fatcaCheck: z.object({
    label: z.string(),
    text: z.string(),
    options: z.array(
      z.object({label: z.string(), value: z.enum(["yes", "no"])}),
    ),
    response: z.enum(["yes", "no"]),
  }),
});

const jobSchema = z.object({
  position: z.object({
    options: z.array(
      z.object({
        label: z.string(),
        value: z.enum(getOptionsValues(jobPositionOptions)),
      }),
    ),
    response: z.enum(getOptionsValues(jobPositionOptions)),
  }),
  positionOther: z.string().optional(),
  tAECode: z.object({
    options: z.array(
      z.object({
        label: z.string(),
        value: z.enum(getOptionsValues(tAECodeOptions)),
      }),
    ),
    response: z.enum(getOptionsValues(tAECodeOptions)),
  }),
  province: z.string().optional(),
  country: z.string().optional(),
});

const pepSchema = z.object({
  isPep: z.object({
    options: z.array(
      z.object({
        label: z.string(),
        value: z.enum(getOptionsValues(yesNoOptions)),
      }),
    ),
    response: z.enum(getOptionsValues(yesNoOptions)),
  }),
  publicOffice: z.object({
    options: z.array(
      z.object({
        label: z.string(),
        value: z.enum(getOptionsValues(publicOfficesOptions)),
      }),
    ),
    response: z.enum(getOptionsValues(publicOfficesOptions)),
  }),
  otherPep: z.object({
    options: z.array(
      z.object({
        label: z.string(),
        value: z.enum(getOptionsValues(yesNoOptions)),
      }),
    ),
    response: z.enum(getOptionsValues(yesNoOptions)),
  }),
  job: jobSchema,
  fundSource: z.string(),
  fundSourceOther: z.string().optional(),
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
    address: z.string().nullable(),
    street_number: z.string().nullable(),
    zip_code: z.string().nullable(),
    city: z.string().nullable(),
    region: z.string().nullable(),
    citizenship: z.string().nullable(),
    json_pep: zu.stringToJSON().pipe(pepSchema).nullable(),
  })
  .transform(
    ({
      date_birth,
      place_birth,
      region_birth,
      fiscal_code,
      last_privacy_esign_id,
      json_fatca,
      street_number,
      zip_code,
      json_pep,
      ...data
    }) => {
      return {
        ...data,
        birthDate: date_birth,
        birthPlace: place_birth,
        birthProvince: region_birth,
        fiscalCode: fiscal_code,
        lastPrivacyEsignId: last_privacy_esign_id,
        fatca: json_fatca,
        streetNumber: street_number,
        zipCode: zip_code,
        pep: json_pep,
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
