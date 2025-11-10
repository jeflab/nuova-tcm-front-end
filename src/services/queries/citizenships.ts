import {queryOptions} from "@tanstack/react-query";
import {getCitizenships} from "../actions/citizenships";

export function citizenshipsQuery() {
  return queryOptions({
    queryKey: ["citizenships"],
    queryFn: async () => {
      const citizenships = await getCitizenships();
      if (citizenships?.status !== "success") {
        throw new Error("Impossibile recuperare l'elenco nazionalità");
      }

      return citizenships.citizenships;
    },
    staleTime: "static",
    retry: 5,
  });
}
