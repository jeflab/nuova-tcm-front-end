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
  console.log("server function getCitizenships called");
  return get("/citizenships/form-options", {payloadShape: citizenshipShape});
}

// TODO: funzione di test per vedere quante volte viene chiamata. Da togliere e unificare con la precedente
export async function getCitizenshipsQuery() {
  console.log("server function getCitizenshipsQuery called");
  return get("/citizenships/form-options", {payloadShape: citizenshipShape});
}
