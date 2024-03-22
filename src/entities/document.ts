import {PDFType} from "@/entities/esign";
import {z} from "zod";

const FileEsignSchema = z.object({
  whoEsign: z.string(),
  required: z.boolean(),
  description: z.string(),
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
  urlPreview: z.string(),
  type: z.nativeEnum(PDFType),
  esigns: z.array(FileEsignSchema),
});
export type Document = z.infer<typeof DocumentSchema>;

export const DocumentsSchema = z.array(DocumentSchema);
export type Documents = z.infer<typeof DocumentsSchema>;
