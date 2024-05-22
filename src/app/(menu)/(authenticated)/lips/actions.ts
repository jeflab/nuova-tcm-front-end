"use server";

import {lipSchema, lipStateSchema} from "@/models/entities/lip";
import {get} from "@/services/api";
import {z} from "zod";

interface GetLipsListOptions {
  query: string;
  page: number;
  perPage: number;
  sorting: string;
}

const getLipsShape = {
  lips: z
    .object({
      data: z.array(lipSchema),
      from: z.number().nullable(),
      last_page: z.number(),
      links: z.any(),
      to: z.number().nullable(),
      total: z.number(),
    })
    .transform(({last_page, ...data}) => {
      return {
        ...data,
        lastPage: last_page,
      };
    }),
  // lipStates: z.array(lipStatesSchema), // TODO: questa chiamata servirà per i filtri
};

export async function getLipsList({
  query,
  page,
  perPage,
  sorting,
}: GetLipsListOptions) {
  return get("/lips", {
    payloadShape: getLipsShape,
    searchParams: {
      query,
      page: page.toString(),
      per_page: perPage.toString(),
      sorting,
    },
  });
}
