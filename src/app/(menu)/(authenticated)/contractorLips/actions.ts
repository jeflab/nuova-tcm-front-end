"use server";

import {
  contractorSchema,
  lipSchema,
} from "@/app/(menu)/(authenticated)/contractorLips/models";
import {get} from "@/services/api";
import {z} from "zod";

const getContractorLipsShape = {
  lips: z.array(lipSchema),
  contractor: contractorSchema,
};

export async function getContractorLips() {
  return await get(`/contractor-lips`, getContractorLipsShape);
}
