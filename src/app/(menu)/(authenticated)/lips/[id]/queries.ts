import {computeDrawerStates} from "@/app/(menu)/(authenticated)/lipsDrawers/drawerState";
import {normalizeError} from "@/helpers/errors";
import {PreliminaryData} from "@/models/preliminaryData";
import {queryOptions} from "@tanstack/react-query";
import {
  getActiveFirstPayment,
  getActiveSubscription,
  getLastPrivacy,
  getLip,
} from "./actions";
import {LipQueryData, lipQueryDataFrom} from "./lipCache";

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

export function getLipQuery(lipId: "new" | number) {
  return queryOptions({
    queryKey: ["lip", lipId],
    queryFn: async (): Promise<LipQueryData> => {
      if (lipId === "new") {
        return {
          lip: {} as PreliminaryData,
          drawerStates: computeDrawerStates({} as PreliminaryData),
        };
      }

      return lipQueryDataFrom(await getLip(Number(lipId)));
    },
    enabled: lipId === "new" || !!Number(lipId),
    staleTime: lipId === "new" ? Infinity : 60_000,
  });
}

export const getLastPrivacyQuery = () =>
  queryOptions({
    queryKey: ["lastPrivacy"] as const,
    queryFn: async () => {
      const response = await getLastPrivacy();

      if (!response) {
        throw new Error(
          "Impossibile recuperare l'ultima privacy, riprova più tardi",
        );
      }

      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response.privacy;
    },
    staleTime: Infinity,
  });

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
    enabled: !isNaN(lipId) && !!lipId,
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
    enabled: !isNaN(lipId) && !!lipId,
  });
