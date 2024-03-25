"use server";

import {lipSchema} from "@/models/entities/lip";
import {get} from "@/services/api";
import {z} from "zod";
import {personalDataSchema} from "@/models/entities/personalData";

const getContractorLipsShape = {
  lips: z.array(lipSchema),
  contractor: personalDataSchema,
};

export async function getContractorLips() {
  return await get(`/contractor-lips`, getContractorLipsShape);
}
