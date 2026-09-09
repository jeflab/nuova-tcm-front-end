import type {getLip} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {computeDrawerStates} from "@/app/(menu)/(authenticated)/lipsDrawers/drawerState";
import {normalizeError} from "@/helpers/errors";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {DrawerState} from "@/ui/drawer/types";
import {QueryClient} from "@tanstack/react-query";
import {notFound} from "next/navigation";

export type LipCache<T> = {
  lip: T;
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
};

export type LipQueryData = LipCache<Lip | PreliminaryData>;
export function lipQueryDataFrom(
  response: Awaited<ReturnType<typeof getLip>>,
): LipQueryData {
  if (!response) {
    throw new Error(
      "Impossibile recuperare la proposta di polizza, riprova più tardi",
    );
  }

  if (response.status !== "success") {
    if (response?.responseStatus === 404) {
      notFound();
    }

    throw normalizeError(response);
  }

  return {
    lip: response.lip as Lip,
    drawerStates: computeDrawerStates(response.lip),
  };
}

export function updateLipCache<T extends Lip | PreliminaryData>(
  queryClient: QueryClient,
  lipId: number | "new",
  transform: (lip: T) => T,
) {
  const result = queryClient.setQueryData(
    ["lip", lipId],
    (old: LipCache<T>): LipCache<T> => {
      const updatedLip = transform(old.lip);

      return {
        lip: updatedLip,
        drawerStates: computeDrawerStates(updatedLip),
      };
    },
  );

  if (lipId !== "new") {
    void queryClient.invalidateQueries({queryKey: ["lips"]});
  }

  return result;
}

export function setLipCache<T extends Lip | PreliminaryData>(
  queryClient: QueryClient,
  lipId: number | "new",
  lip: T,
) {
  const result = queryClient.setQueryData(["lip", lipId], {
    lip,
    drawerStates: computeDrawerStates(lip),
  } satisfies LipCache<T>);

  if (lipId !== "new") {
    void queryClient.invalidateQueries({queryKey: ["lips"]});
  }

  return result;
}
