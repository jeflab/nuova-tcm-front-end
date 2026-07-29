import {
  jobPositionOptions,
  publicOfficesOptions,
  tAECodeOptions,
  yesNoOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {stringToJSON} from "@/helpers/stringToJSON";
import {citizenshipSchema} from "@/models/entities/citizenship";
import {identityDocumentSchema} from "@/models/entities/identityDocument";
import {getOptionsValues} from "@/helpers/getOptionsLabel";
import {Prettify} from "@/helpers/TypesHelper";
import {z} from "zod";

const fatcaSchema = z.object({
  fatcaCheck: z.object({
    label: z.string(),
    text: z.string(),
    options: z.array(
      z.object({label: z.string(), value: z.enum(["yes", "no"])}),
    ),
    response: z.enum(["yes", "no"]),
  }),
  residencyCheck: z.object({
    options: z.array(
      z.object({label: z.string(), value: z.enum(["yes", "no"])}),
    ),
    response: z.enum(["yes", "no"]),
  }),
});

const contractorJobSchema = z.object({
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
  tAECode: z
    .object({
      options: z.array(
        z.object({
          label: z.string(),
          value: z.enum(getOptionsValues(tAECodeOptions)),
        }),
      ),
      response: z.enum([...getOptionsValues(tAECodeOptions), ""]),
    })
    .optional(),
  type: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
});

const contractorPepSchema = z.object({
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
  job: contractorJobSchema,
});

export const contractorSchema = z
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
    gender: z.enum(["male", "female"]),
    last_privacy_esign_id: z.number().nullable(),
    json_fatca: stringToJSON().pipe(fatcaSchema),
    address: z.string().nullable(),
    street_number: z.string().nullable(),
    zip_code: z.string().nullable(),
    city: z.string().nullable(),
    region: z.string().nullable(),
    citizenship: z.string().nullable(),
    citizenship_instance: citizenshipSchema.nullish(),
    second_citizenship: z.string().nullable(),
    second_citizenship_instance: citizenshipSchema.nullish(),
    json_pep: stringToJSON().pipe(contractorPepSchema).nullable().optional(),
    identitydocument: z.array(identityDocumentSchema).optional(),
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
      citizenship_instance,
      second_citizenship,
      second_citizenship_instance,
      json_pep,
      identitydocument,
      ...data
    }) => {
      return {
        ...data,
        birthDate: date_birth,
        birthPlace: place_birth,
        birthProvince: region_birth,
        fiscalCode: fiscal_code,
        lastPrivacyESignId: last_privacy_esign_id,
        fatca: json_fatca,
        streetNumber: street_number,
        zipCode: zip_code,
        citizenshipInstance: citizenship_instance,
        secondCitizenship: second_citizenship,
        secondCitizenshipInstance: second_citizenship_instance,
        pep: json_pep,
        identityDocument: identitydocument,
      };
    },
  );
export type Contractor = Prettify<z.infer<typeof contractorSchema>>;

const insuredJobSchema = z.object({
  positionOther: z.string().optional(),
});

const insuredPepSchema = z.object({
  job: insuredJobSchema,
});
export const insuredSchema = z
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
    gender: z.enum(["male", "female"]),
    last_privacy_esign_id: z.number().nullish(),
    json_fatca: stringToJSON().pipe(fatcaSchema),
    address: z.string().nullable(),
    street_number: z.string().nullable(),
    zip_code: z.string().nullable(),
    city: z.string().nullable(),
    region: z.string().nullable(),
    citizenship: z.string().nullable(),
    citizenship_instance: citizenshipSchema.nullish(),
    second_citizenship: z.string().nullable(),
    second_citizenship_instance: citizenshipSchema.nullish(),
    json_pep: stringToJSON().pipe(insuredPepSchema).nullable().optional(),
    identitydocument: z.array(identityDocumentSchema).optional(),
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
      citizenship_instance,
      second_citizenship,
      second_citizenship_instance,
      json_pep,
      identitydocument,
      ...data
    }) => {
      return {
        ...data,
        birthDate: date_birth,
        birthPlace: place_birth,
        birthProvince: region_birth,
        fiscalCode: fiscal_code,
        lastPrivacyESignId: last_privacy_esign_id,
        fatca: json_fatca,
        streetNumber: street_number,
        zipCode: zip_code,
        citizenshipInstance: citizenship_instance,
        secondCitizenship: second_citizenship,
        secondCitizenshipInstance: second_citizenship_instance,
        pep: json_pep,
        identityDocument: identitydocument,
      };
    },
  );
export type Insured = Prettify<z.infer<typeof insuredSchema>>;

export type PersonalData = Contractor | Insured;

export function getValidIdentityDocument(personalData: PersonalData) {
  const identityDocument = personalData.identityDocument?.at(-1);

  if (!identityDocument) {
    throw new Error("Nessun documento di identità trovato.");
  }

  return identityDocument;
}
