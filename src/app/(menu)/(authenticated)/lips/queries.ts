import {getLipsList} from "@/app/(menu)/(authenticated)/lips/actions";
import {normalizeError} from "@/helpers/errors";
import {DataTableParams} from "@/ui/table/helpers";
import {queryOptions} from "@tanstack/react-query";

export function getLipsListQuery(params: DataTableParams) {
  return queryOptions({
    queryKey: ["lips", params] as const,
    queryFn: async () => {
      const response = await getLipsList(params);

      if (!response) {
        throw new Error(
          "Impossibile recuperare l'elenco delle proposte di polizza, riprova più tardi",
        );
      }

      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return {lips: response.lips, lipstates: response.lipstates};
    },
  });
}
