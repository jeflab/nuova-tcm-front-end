import {getAccount} from "@/app/(no-menu)/(auth)/actions";
import {normalizeError} from "@/helpers/errors";
import {queryOptions} from "@tanstack/react-query";

export const getAccountQuery = () =>
  queryOptions({
    queryKey: ["Account"] as const,
    queryFn: async () => {
      const response = await getAccount();

      if (!response) {
        throw new Error(
          "Impossibile recuperare l'account utente, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
  });
