import {lipDocumentsSchema} from "@/models/entities/lip";
import {z} from "zod";

export const searchPramsSchema = z.discriminatedUnion("uri", [
  z.object({
    uri: z.enum([
      "pdf-mup",
      "pdf-allegato3",
      "pdf-allegato4ter",
      "pdf-elenco-compagnie",
      "pdf-certificato",
      "pdf-residence-proof",
      "pdf-residence-proof-assicurato",
    ]),
    lipId: z.coerce.number(),
    agentId: z.coerce.number(),
  }),
  z.object({
    uri: z.enum([
      "pdf-privacy",
      "pdf-identificazione",
      "pdf-identificazione-preview",
      "pdf-identificazione-assicurato",
      "pdf-identificazione-assicurato-preview",
      "pdf-proposta",
      "pdf-proposta-preview",
      "pdf-allegato4",
      "set-informativo",
      "pdf-underwriting-sanitario",
      "pdf-underwriting-sportivo",
    ]),
    lipId: z.coerce.number(),
    agentId: z.coerce.number(),
    contractorId: z.coerce.number(),
  }),
  z.object({
    uri: z.enum(["pdf-dur"]),
    lipId: z.coerce.number(),
    year: z.coerce.string(),
  }),
]);
export type DownloadDocumentsSearchParams = z.infer<typeof searchPramsSchema>;

export type DocumentManagementDownloadUris =
  | "pdf-identificazione"
  | "pdf-identificazione-assicurato"
  | "pdf-allegato4"
  | "set-informativo"
  | "pdf-proposta";
// fileMUP
export type DocumentManagementPreviewUris =
  | "pdf-identificazione-preview"
  | "pdf-identificazione-assicurato-preview"
  | "pdf-allegato4"
  | "set-informativo"
  | "pdf-proposta-preview";

type LipDocumentsKeys = keyof z.infer<typeof lipDocumentsSchema>;

export const lipDocToUriMap: Partial<
  Record<LipDocumentsKeys, DownloadDocumentsSearchParams["uri"]>
> = {
  fileAllegato3: "pdf-allegato3",
  fileAllegato4: "pdf-allegato4",
  fileAllegato4TER: "pdf-allegato4ter",
  fileElencoCompagnie: "pdf-elenco-compagnie",
  fileSetInformativo: "set-informativo",
  fileCertificatoPDF: "pdf-certificato",
  filePolizza: "pdf-proposta",
  fileDUR: "pdf-dur",
  // fileCertificatoXML: "",
};
