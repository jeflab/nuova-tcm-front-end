"use server";

import {lipSchema} from "@/models/entities/lip";
import {get} from "@/services/api";
import {z} from "zod";
import {contractorSchema} from "@/models/entities/personalData";

const getContractorLipsShape = {
  lips: z.array(lipSchema),
  contractor: contractorSchema.nullable(),
};

export async function getContractorLips() {
  return await get(`/contractor-lips`, {payloadShape: getContractorLipsShape});
}
