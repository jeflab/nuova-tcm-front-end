import {z} from "zod";

export const searchPramsSchema = z.discriminatedUnion("uri", [
  z.object({
    uri: z.enum([
      "pdf-mup",
      "pdf-allegato3",
      "pdf-allegato4ter",
      "pdf-elenco-compagnie",
      "pdf-certificato",
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
]);
export type DownloadDocumentsSearchParams = z.infer<typeof searchPramsSchema>;

export const lipDocumentsKeys = [
  "fileMUP",
  "fileAllegato3",
  "fileAllegato4",
  "fileAllegato4TER",
  "fileElencoCompagnie",
  "fileSetInformativo",
  "fileCertificatoXML",
  "fileCertificatoPDF",
  "filePolizza",
] as const;

export const lipDocToUriMap: Partial<
  Record<
    (typeof lipDocumentsKeys)[number],
    DownloadDocumentsSearchParams["uri"]
  >
> = {
  fileAllegato3: "pdf-allegato3",
  fileAllegato4: "pdf-allegato4",
  fileAllegato4TER: "pdf-allegato4ter",
  fileElencoCompagnie: "pdf-elenco-compagnie",
  fileSetInformativo: "set-informativo",
  fileCertificatoPDF: "pdf-certificato",
  filePolizza: "pdf-proposta",
  // fileCertificatoXML: "",
};
