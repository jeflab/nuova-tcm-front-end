"use server";

import {esignSchema, PDFType} from "@/entities/esign";
import {post, put} from "@/services/api";

const createFEATransactionSchema = {
  esign: esignSchema,
};
interface CreateFEATransactionParams<TPayload> {
  contractorId?: number;
  lipId: number;
  payload: TPayload;
  pdfType: PDFType;
}

export async function createFEATransaction<TPayload>({
  pdfType,
  payload,
  contractorId,
  lipId,
}: CreateFEATransactionParams<TPayload>) {
  return post(
    "/esigns/create-featransaction",
    createFEATransactionSchema,
    JSON.stringify({
      pdfType,
      contractorId,
      lipId,
      ...payload,
    }),
  );
}

interface SignFEADocParams {
  OTP: string;
  lipId: number;
  pdfType: PDFType;
  transactionId: string;
}

export async function signFEADoc(data: SignFEADocParams) {
  return put("/esigns/sign-feadoc", {}, JSON.stringify(data));
}
