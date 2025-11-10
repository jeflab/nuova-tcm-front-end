import {normalizeError} from "@/helpers/errors";
import {getActiveFirstPayment, getActiveSubscription} from "./actions";
import {queryOptions} from "@tanstack/react-query";

function msUntilExpire(expireAt?: string): number | false {
  if (!expireAt) {
    return false;
  }

  const time = Date.parse(expireAt);
  if (Number.isNaN(time)) {
    return false;
  }

  const remaining = time - Date.now();
  return remaining > 0 ? remaining : 10000;
}

export const getActiveFirstPaymentQuery = (lipId: number) =>
  queryOptions({
    queryKey: ["activeFirstPayment", lipId] as const,
    queryFn: async () => {
      const response = await getActiveFirstPayment(lipId);

      if (!response) {
        throw new Error(
          "Impossibile recuperare il pagamento, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    enabled: !!lipId,
    refetchInterval: (data) => {
      return msUntilExpire(data.state.data?.first_payment?.expiresAt);
    },
  });

export const getActiveSubscriptionQuery = (lipId: number) =>
  queryOptions({
    queryKey: ["activeSubscription", lipId] as const,
    queryFn: async () => {
      const response = await getActiveSubscription(lipId);

      if (!response) {
        throw new Error(
          "Impossibile recuperare la sottoscrizione, riprova più tardi",
        );
      }

      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    enabled: !!lipId,
  });
