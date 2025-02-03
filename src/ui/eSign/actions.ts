"use server";

import {ESign} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsManagement";
import {getProfile} from "@/app/(no-menu)/(auth)/actions";
import {esignSchema, PDFType} from "@/models/entities/esign";
import {lipSchema} from "@/models/entities/lip";
import {patch, post, put} from "@/services/api";
import {Tag, Tags} from "@/services/const";

const createFEATransactionSchema = {
  esign: esignSchema,
};
interface CreateFEATransactionParams {
  contractorId?: number;
  lipId: number;
}

export async function createFEATransaction(data: CreateFEATransactionParams) {
  const featTransaction = post("/esigns/create-featransaction", {
    payloadShape: createFEATransactionSchema,
    data,
  });
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
  lipId: number;
  OTP: string;
  payload: TPayload;
  pdfType: PDFType;
  personalDataId?: number;
  tagToRevalidate?: Tag;
  transactionId: string;
  whoESign: ESign["whoESign"];
}

export async function signFEADoc<TPayload>({
  lipId,
  OTP,
  payload,
  pdfType,
  personalDataId,
  tagToRevalidate,
  transactionId,
  whoESign,
}: SignFEADocParams<TPayload>) {
  return put("/esigns/sign-feadoc", {
    payloadShape: signFEADocSchema,
    data: {
      OTP,
      transactionId,
      lipId,
      pdfType,
      ...(whoESign === "contractor" && {contractorId: personalDataId}),
      ...(whoESign === "insured" && {insuredId: personalDataId}),
      ...payload,
    },
    ...(tagToRevalidate && {tags: [tagToRevalidate]}),
  });
}

export async function updateContractorPhone(
  personalDataId: number,
  lipId: number,
  phone: string,
) {
  return patch(`/personal-datas/${personalDataId}`, {
    data: {phone},
    tags: [Tags.getLip(lipId)],
  });
}

export async function updateAgentPhone(agentId: number, phone: string) {
  return patch(`/agents/${agentId}/update-phone`, {
    data: {phone},
  });
}
