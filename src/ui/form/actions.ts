"use server";

import {get} from "@/services/api";
import {z} from "zod";

const citizenshipShape = {
  citizenships: z.array(
    z.object({
      alpha3: z.string(),
      citizenship: z.string(),
    }),
  ),
};
export async function getCitizenships() {
  return get("/citizenships/form-options", {payloadShape: citizenshipShape});
}
