"use client";

import {queryOptions} from "@tanstack/react-query";
import {getCitizenships} from "../actions/citizenships";

const oneDayInMs = 1000 * 60 * 60 * 24;

export function citizenshipsOptions() {
  return queryOptions({
    queryKey: ["citizenships"],
    queryFn: async () => {
      const citizenships = await getCitizenships();
      if (citizenships?.status !== "success") {
        throw new Error("Impossibile recuperare l'elenco nazionalità");
      }

      return citizenships.citizenships;
    },
    staleTime: oneDayInMs,
  });
}
