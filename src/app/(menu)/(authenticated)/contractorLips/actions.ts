"use server";

import {lipSchema} from "@/entities/lip";
import {get} from "@/services/api";
import {z} from "zod";
import {contractorSchema} from "@/entities/contractor";

const getContractorLipsShape = {
  lips: z.array(lipSchema),
  contractor: contractorSchema,
};

export async function getContractorLips() {
  return await get(`/contractor-lips`, getContractorLipsShape);
}
