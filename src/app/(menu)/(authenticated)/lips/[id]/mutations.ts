import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {computeDrawerStates} from "@/app/(menu)/(authenticated)/lipsDrawers/drawerState";
import {LipWithContractorIdentification} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/identificationValidators";
import {normalizeError} from "@/helpers/errors";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {DrawerState} from "@/ui/drawer/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
  activateContractor,
  createRecurringPayment,
  identificationContractor,
  updateContractorContacts,
  updateDen,
  updatePersonalData,
} from "./actions";

export const useCreateRecurringPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {lipId: number}) => {
      const response = await createRecurringPayment(variables.lipId);

      if (!response) {
        throw new Error(
          "Impossibile creare il pagamento ricorrente, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    onSuccess: (data, {lipId}) => {
      queryClient.setQueryData(["activeFirstPayment", lipId], data);
    },
  });
};

export const useUpdateLipLocalDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      lipId: "new";
      data: Partial<PreliminaryData>;
    }) => {
      return variables.data;
    },
    onSuccess: (newData, {lipId}) => {
      queryClient.setQueryData(
        ["lip", lipId],
        (
          old:
            | {
                lip: PreliminaryData;
                drawerStates: Partial<Record<DrawerName, DrawerState>>;
              }
            | undefined,
        ) => {
          if (!old) return old;

          const updatedLip = {
            ...old.lip,
            ...newData,
          };

          const updatedDrawerStates = computeDrawerStates(updatedLip);

          return {
            lip: updatedLip,
            drawerStates: updatedDrawerStates,
          };
        },
      );
    },
  });
};

export const useActivateContractorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      contractorData: Parameters<typeof activateContractor>[0],
    ) => {
      const response = await activateContractor(contractorData);

      if (!response) {
        throw new Error(
          "Impossibile attivare il contraente, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    onSuccess: ({lip: createdLip}) => {
      queryClient.setQueryData(["lip", createdLip.id], () => {
        const updatedDrawerStates = computeDrawerStates(createdLip);

        return {
          lip: createdLip,
          drawerStates: updatedDrawerStates,
        };
      });
    },
  });
};

export const useUpdateContractorContactsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractorId,
      formData,
    }: {
      lipId: number;
      contractorId: number;
      formData: Parameters<typeof updateContractorContacts>[1];
    }) => {
      const response = await updateContractorContacts(contractorId, formData);

      if (!response) {
        throw new Error(
          "Impossibile aggiornare i dati del contraente, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    onSuccess: ({personalData: updatedContractor}, {lipId}) => {
      queryClient.setQueryData(
        ["lip", lipId] as const,
        (old: {
          lip: PreliminaryData;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            contractor: {
              ...old.lip.contractor,
              ...updatedContractor,
            },
          };
          const updatedDrawerStates = computeDrawerStates(updatedLip);

          return {
            lip: updatedLip,
            drawerStates: updatedDrawerStates,
          };
        },
      );
    },
  });
};

export const useUpdatePersonalDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      personalDataId,
      formData,
    }: {
      lipId: number;
      personalDataId: number;
      personalDataType: "contractor" | "insured";
      formData: Parameters<typeof updatePersonalData>[1];
    }) => {
      const response = await updatePersonalData(personalDataId, formData);

      if (!response) {
        throw new Error(
          "Impossibile aggiornare i dati personali della persona, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    onSuccess: (
      {personalData: updatedPersonalData},
      {lipId, personalDataType},
    ) => {
      queryClient.setQueryData(
        ["lip", lipId] as const,
        (old: {
          lip: PreliminaryData;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            [personalDataType]: {
              ...old.lip[personalDataType],
              ...updatedPersonalData,
            },
          };
          const updatedDrawerStates = computeDrawerStates(updatedLip);

          console.log({oldLip: old.lip, updatedPersonalData, updatedLip});

          return {
            lip: updatedLip,
            drawerStates: updatedDrawerStates,
          };
        },
      );
    },
  });
};

export const useIdentificationContractor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      contractorFiscalCode,
    }: {
      lipId: number;
      formData: Parameters<typeof identificationContractor>[0];
      contractorFiscalCode: string;
    }) => {
      const response = await identificationContractor(
        formData,
        contractorFiscalCode,
      );

      if (!response) {
        throw new Error(
          "Impossibile completare l'identificazione del contraente, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    onSuccess: ({identityDocument}, {lipId}) => {
      queryClient.setQueryData(
        ["lip", lipId] as const,
        (old: {
          lip: Lip;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            contractor: {
              ...old.lip.contractor,
              identityDocument: [identityDocument],
            },
          };
          const updatedDrawerStates = computeDrawerStates(updatedLip);

          return {
            lip: updatedLip,
            drawerStates: updatedDrawerStates,
          };
        },
      );
    },
  });
};

export const useUpdateDen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lipId,
      formData,
    }: {
      lipId: number;
      formData: Parameters<typeof updateDen>[1];
    }) => {
      const response = await updateDen(lipId, formData);

      if (!response) {
        throw new Error(
          "Impossibile aggiornare i dati del DEN, riprova più tardi",
        );
      }
      if (response.status !== "success") {
        throw normalizeError(response);
      }

      return response;
    },
    onSuccess: ({lip}, {lipId}) => {
      queryClient.setQueryData(
        ["lip", lipId] as const,
        (old: {
          lip: LipWithContractorIdentification;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            den: {
              ...lip.den!,
            },
          };
          const updatedDrawerStates = computeDrawerStates(updatedLip);

          console.log({oldLip: old.lip, updatedDenData: lip, updatedLip});

          return {
            lip: updatedLip,
            drawerStates: updatedDrawerStates,
          };
        },
      );
    },
  });
};
