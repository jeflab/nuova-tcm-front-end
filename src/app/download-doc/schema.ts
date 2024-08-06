import {z} from "zod";

export const searchPramsSchema = z.discriminatedUnion("uri", [
  z.object({
    uri: z.enum(["pdf-allegato3", "pdf-allegato4ter", "pdf-elenco-compagnie"]),
    lipId: z.coerce.number(),
    agentId: z.coerce.number(),
  }),
  z.object({
    uri: z.enum([
      "pdf-privacy",
      "pdf-identificazione",
      "pdf-identificazione-preview",
      "pdf-proposta",
      "pdf-proposta-preview",
      "pdf-allegato4",
      "set-informativo",
      "pdf-underwriting-sanitario",
      "pdf-certificato",
    ]),
    lipId: z.coerce.number(),
    agentId: z.coerce.number(),
    contractorId: z.coerce.number(),
  }),
]);
export type DownloadDocumentsSearchParams = z.infer<typeof searchPramsSchema>;
