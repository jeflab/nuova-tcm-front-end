"use server";

import {getProfile} from "@/app/(no-menu)/(auth)/actions";
import {esignSchema, PDFType} from "@/models/entities/esign";
import {lipSchema} from "@/models/entities/lip";
import {post, put} from "@/services/api";
import {revalidateTag} from "next/cache";

const createFEATransactionSchema = {
  esign: esignSchema,
};
interface CreateFEATransactionParams {
  contractorId?: number;
  lipId: number;
}

export async function createFEATransaction({
  contractorId,
  lipId,
}: CreateFEATransactionParams) {
  const featTransaction = post(
    "/esigns/create-featransaction",
    createFEATransactionSchema,
    JSON.stringify({
      contractorId,
      lipId,
    }),
  );
  const profile = getProfile();
  return {
    featTransaction: await featTransaction,
    profile: await profile,
  };
}

const signFEADocSchema = {
  lip: lipSchema.optional(),
};
interface SignFEADocParams<TPayload> {
  contractorId?: number;
  lipId: number;
  OTP: string;
  payload: TPayload;
  pdfType: PDFType;
  tagToRevalidate?: string;
  transactionId: string;
}

export async function signFEADoc<TPayload>({
  contractorId,
  lipId,
  OTP,
  payload,
  pdfType,
  tagToRevalidate,
  transactionId,
}: SignFEADocParams<TPayload>) {
  if (tagToRevalidate) {
    revalidateTag(tagToRevalidate);
  }
  return put(
    "/esigns/sign-feadoc",
    signFEADocSchema,
    JSON.stringify({
      OTP,
      transactionId,
      lipId,
      pdfType,
      contractorId,
      ...payload,
    }),
  );
}
