import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {LipWithBeneficiaries} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/beneficiariesValidators";
import {computeDrawerStates} from "@/app/(menu)/(authenticated)/lipsDrawers/drawerState";
import {LipWithHealthQuestionnaire} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/healthQuestionnaireValidators";
import {LipWithContractorIdentification} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/identificationValidators";
import {LipWithInsuredData} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredData/insuredDataValidators";
import {LipWithPayment} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/paymentValidators";
import {normalizeError} from "@/helpers/errors";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {DrawerState} from "@/ui/drawer/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
  activateContractor,
  addInsuredData,
  createRecurringPayment,
  identificationContractor,
  identificationInsured,
  saveCompanyPrivacyConsent,
  updateBeneficiaries,
  updateContractorContacts,
  updateDen,
  updateHealthQuestionnaire,
  updatePaymentData,
  updatePersonalData,
  updateQuotation,
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

      // Aggiungiamo il click sul link di pagamento mollie alla lip
      queryClient.setQueryData(
        ["lip", lipId],
        (old: {
          lip: LipWithBeneficiaries & {payment: NonNullable<Lip["payment"]>};
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            payment: {
              ...old.lip.payment,
              mollieLinkClicked: true,
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
        (old: {
          lip: PreliminaryData;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
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
            den: lip.den,
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

export const useAddInsuredDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lipId,
      formData,
    }: {
      lipId: number;
      formData: Parameters<typeof addInsuredData>[1];
    }) => {
      const response = await addInsuredData(lipId, formData);

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
          lip: Lip;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            insured: lip.insured,
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

export const useIdentificationInsured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      insuredFiscalCode,
    }: {
      lipId: number;
      formData: Parameters<typeof identificationInsured>[0];
      insuredFiscalCode: string;
    }) => {
      const response = await identificationInsured(formData, insuredFiscalCode);

      if (!response) {
        throw new Error(
          "Impossibile completare l'identificazione dell'assicurato, riprova più tardi",
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
          lip: LipWithInsuredData;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            insured: {
              ...old.lip.insured,
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

export const useUpdateQuotationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lipId,
      formData,
      shouldResetHealthQuestionnaire,
    }: {
      lipId: number;
      formData: Parameters<typeof updateQuotation>[0];
      shouldResetHealthQuestionnaire: boolean;
    }) => {
      const response = await updateQuotation(
        formData,
        lipId,
        shouldResetHealthQuestionnaire,
      );

      if (!response) {
        throw new Error(
          "Impossibile aggiornare la quotazione, riprova più tardi",
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
          lip: Lip;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            ...lip,
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

export const useUpdateHealthQuestionnaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lipId,
      formData,
    }: {
      lipId: number;
      formData: Parameters<typeof updateHealthQuestionnaire>[1];
    }) => {
      const response = await updateHealthQuestionnaire(lipId, formData);

      if (!response) {
        throw new Error(
          "Impossibile aggiornare il questionario sanitario, riprova più tardi",
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
          lip: LipWithHealthQuestionnaire;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            ...lip,
          };

          const updatedDrawerStates = computeDrawerStates(updatedLip);

          console.log({oldLip: old.lip, lip, updatedLip});

          return {
            lip: updatedLip,
            drawerStates: updatedDrawerStates,
          };
        },
      );
    },
  });
};

export const useUpdateBeneficiaries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lipId,
      formData,
    }: {
      lipId: number;
      formData: Parameters<typeof updateBeneficiaries>[1];
    }) => {
      const response = await updateBeneficiaries(lipId, formData);

      if (!response) {
        throw new Error(
          "Impossibile aggiornare i beneficiari, riprova più tardi",
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
          lip: LipWithHealthQuestionnaire;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            ...lip,
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

export const useUpdatePaymentData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lipId,
      formData,
    }: {
      lipId: number;
      formData: Parameters<typeof updatePaymentData>[1];
    }) => {
      const response = await updatePaymentData(lipId, formData);

      if (!response) {
        throw new Error(
          "Impossibile aggiornare i dati di pagamento, riprova più tardi",
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
          lip: LipWithBeneficiaries;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            ...lip,
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

export const useSaveCompanyPrivacyConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lipId,
      formData,
    }: {
      lipId: number;
      formData: Parameters<typeof saveCompanyPrivacyConsent>[1];
    }) => {
      const response = await saveCompanyPrivacyConsent(lipId, formData);

      if (!response) {
        throw new Error(
          "Impossibile salvare il consenso alla privacy di compagnia, riprova più tardi",
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
          lip: LipWithPayment;
          drawerStates: Partial<Record<DrawerName, DrawerState>>;
        }) => {
          const updatedLip = {
            ...old.lip,
            ...lip,
          };

          console.log({oldLip: old.lip, lip, updatedLip});

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
