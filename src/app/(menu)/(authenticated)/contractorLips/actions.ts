"use server";

import {lipSchema} from "@/entities/lip";
import {get} from "@/services/api";
import {z} from "zod";
import {personalDataSchema} from "@/entities/personalData";

const getContractorLipsShape = {
  lips: z.array(lipSchema),
  contractor: personalDataSchema,
};

export async function getContractorLips() {
  return await get(`/contractor-lips`, getContractorLipsShape);
}
