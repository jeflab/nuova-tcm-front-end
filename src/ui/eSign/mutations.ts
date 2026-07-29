import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {computeDrawerStates} from "@/app/(menu)/(authenticated)/lipsDrawers/drawerState";
import {normalizeError} from "@/helpers/errors";
import {Lip} from "@/models/entities/lip";
import {DrawerState} from "@/ui/drawer/types";
import {createFEATransaction, signFEADoc} from "@/ui/eSign/actions";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import merge from "lodash/merge";

export const useRequestOTPMutation = (data: {
  contractorId?: number;
  lipId: number;
}) =>
  useMutation({
    mutationKey: ["createFEATransaction", data.lipId],
    mutationFn: async () => {
      const response = await createFEATransaction(data);

      if (!response) {
        throw new Error("Impossibile richiedere l'OTP, riprova più tardi");
      }
      if (response.featTransaction?.status !== "success") {
        throw normalizeError(response.featTransaction);
      }
      if (response.profile?.status !== "success") {
        throw normalizeError(response.profile);
      }

      return {
        featTransaction: response.featTransaction,
        profile: response.profile,
      };
    },
  });

export const useSignFEADocMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signFEADocParams: Parameters<typeof signFEADoc>[0]) => {
      const response = await signFEADoc(signFEADocParams);

      if (!response) {
        throw new Error("Impossibile firmare il documento, riprova più tardi");
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    onSuccess: ({lip}, {lipId}) => {
      queryClient.setQueryData(
        ["lip", lipId],
        (old: {
          lip: Lip;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = merge({}, old.lip, lip);
          const newDrawerStates = computeDrawerStates(updatedLip);

          return {
            lip: updatedLip,
            drawerStates: newDrawerStates,
          };
        },
      );
    },
  });
};
