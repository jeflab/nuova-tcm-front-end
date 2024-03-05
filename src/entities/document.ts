import {z} from "zod";

const FileEsignSchema = z.object({
  whoEsign: z.string(),
  required: z.boolean(),
  description: z.string(),
  page: z.string(),
  leftX: z.string(),
  leftY: z.string(),
  rightX: z.string(),
  rightY: z.string(),
  esignIndex: z.number().optional(), // me lo sto ricavando io da FE. Ha senso farlo gestire da BE?
  esignId: z.coerce.number().optional(),
  esignDate: z.coerce.date().optional(),
  esignUser: z
    .object({
      name: z.string(),
      surname: z.string(),
      cell: z.string(),
      email: z.string(),
      fiscalCode: z.string(),
    })
    .optional(),
});
export type FileEsign = z.infer<typeof FileEsignSchema>;

const DocumentSchema = z.object({
  fileName: z.string(),
  requiredFile: z.boolean(),
  esigns: z.array(FileEsignSchema),
  allRequiredEsigned: z.boolean().optional(),
  allEsigned: z.boolean().optional(),
});
export type Document = z.infer<typeof DocumentSchema>;

export const DocumentsSchema = z.object({
  totalEsigns: z.number(),
  files: z.array(DocumentSchema),
  allFilesUploaded: z.boolean(),
  allRequiredFilesUploaded: z.boolean(),
});
export type Documents = z.infer<typeof DocumentsSchema>;
