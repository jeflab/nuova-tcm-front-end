import {z} from "zod";

/**
 * Enum con i tipi di documento, per ogni tipo dobbiamo inviare l'id dell'entità
 *  corrispondente
 * *
 *  * templatePrivacy - referenceId -> ID USER
 *  * templatePrivacyContractor - referenceId -> ID CONTRACTOR
 *  * templatePrivacySubscription - referenceId -> ID USER
 *  * templateIdentificazione - referenceId -> ID CAP
 *  * templateAnalisi - referenceId -> ID CAP
 *  * templateProposta - referenceId -> ID PROPOSTA
 *  * templateRaccomandazione - referenceId -> ID RACCOMANDAZIONE
 *  * templateDichiarazioneCoerenzaBene - referenceId -> ID PROPOSTA BENE
 *  * templateDichiarazioneCoerenza - ID CLASSE ELEMENTARE
 *  * templateDichiarazioneAvvenutaConsegnaBene - referenceId -> ID PROPOSTA BENE
 *  * templateDichiarazioneAvvenutaConsegna - referenceId -> ID CLASSE ELEMENTARE
 */
export enum PDFType {
  Privacy = "templatePrivacy",
  Identification = "templateIdentificazione",
  Proposal = "templateProposta",
  // PrivacyContractor = "templatePrivacyContractor",
  // PrivacySubscription = "templatePrivacySubscription",
  // Cap = "templateAnalisi",
  // Recommendation = "templateRaccomandazione",
  // BeneConsistency = "templateDichiarazioneCoerenzaBene",
  // Consistency = "templateDichiarazioneCoerenza",
  // BeneDelivery = "templateDichiarazioneAvvenutaConsegnaBene",
  // Delivery = "templateDichiarazioneAvvenutaConsegna",
  // BeneMarketing = "templateDichiarazioneCoerenzaBeneMarketing",
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
export type ESign = z.infer<typeof esignSchema>;
