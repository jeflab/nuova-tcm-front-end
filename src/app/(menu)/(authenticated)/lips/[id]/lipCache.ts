import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {computeDrawerStates} from "@/app/(menu)/(authenticated)/lipsDrawers/drawerState";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {DrawerState} from "@/ui/drawer/types";
import {QueryClient} from "@tanstack/react-query";

export type LipCache<T> = {
  lip: T;
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
};

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
