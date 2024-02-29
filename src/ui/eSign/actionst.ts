"use server";

import {PDFType} from "@/entities/esign";
import {post} from "@/services/api";

const createFEATransactionSchema = {};
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
