import {z} from "zod";
import {zu} from "zod_utilz";

const identificationSchema = z.object({
  fileIdFrontName: z.string(),
  fileIdBackName: z.string(),
  date: z.string(),
});

export const identityDocumentSchema = z
  .object({
    type: z.string(),
    number: z.string(),
    issued_by: z.string(),
    issued_by_org: z.string(),
    issuing_date: z.coerce.date(),
    expiring_date: z.coerce.date(),
    json_identification: zu
      .stringToJSON()
      .pipe(identificationSchema)
      .nullable(),
    personal_data_id: z.number(),
    id: z.number(),
  })
  .transform(
    ({
      type,
      json_identification,
      issued_by,
      issued_by_org,
      issuing_date,
      personal_data_id,
      expiring_date,
      ...data
    }) => {
      return {
        ...data,
        idType: type,
        issuedBy: issued_by,
        issuedByOrg: issued_by_org,
        issuedDate: issuing_date,
        identification: json_identification,
        personalDataId: personal_data_id,
        expiringDate: expiring_date,
      };
    },
  );
export type IdentityDocument = z.infer<typeof identityDocumentSchema>;
