import {z} from "zod";

export enum PDFType {
  Privacy = "templatePrivacy",
  Identification = "templateIdentificazione",
  Proposal = "templateProposta",
  Allegato4 = "templateAllegato4",
  SetInformativo = "templateSetInformativo",
}

export const esignSchema = z
  .object({
    transaction_id: z.string(),
  })
  .transform(({transaction_id}) => {
    return {
      transactionId: transaction_id,
    };
  });
