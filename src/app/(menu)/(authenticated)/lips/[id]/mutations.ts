import {LipWithBeneficiaries} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/beneficiariesValidators";
import {LipWithContractorIdentification} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/identificationValidators";
import {LipWithInsuredData} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredData/insuredDataValidators";
import {normalizeError} from "@/helpers/errors";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {setLipCache, updateLipCache} from "./lipCache";
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
      updateLipCache<
        LipWithBeneficiaries & {payment: NonNullable<Lip["payment"]>}
      >(queryClient, lipId, (lip) => ({
        ...lip,
        payment: {
          ...lip.payment,
          mollieLinkClicked: true,
        },
      }));
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
      updateLipCache<PreliminaryData>(queryClient, lipId, (lip) => ({
        ...lip,
        ...newData,
      }));
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
      setLipCache<Lip>(queryClient, createdLip.id, createdLip);
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
      updateLipCache<PreliminaryData>(queryClient, lipId, (lip) => ({
        ...lip,
        contractor: {
          ...lip.contractor,
          ...updatedContractor,
        },
      }));
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
      {personalData: updatedPersonalData, lip: updatedRelationship},
      {lipId, personalDataType},
    ) => {
      updateLipCache<PreliminaryData>(queryClient, lipId, (lip) => ({
        ...lip,
        ...updatedRelationship,
        [personalDataType]: {
          ...lip[personalDataType],
          ...updatedPersonalData,
        },
      }));
    },
  });
};

export function applyContractorIdentification(
  lip: Lip,
  identityDocument: NonNullable<Lip["contractor"]["identityDocument"]>[number],
): Lip {
  const contractor = {
    ...lip.contractor,
    identityDocument: [identityDocument],
  };

  if (lip.type !== "self-insured" || !lip.insured) {
    return {...lip, contractor};
  }

  // la applico anche all'assicurato se contraente === assicurato
  const insured = {
    ...lip.insured,
    identityDocument: [identityDocument],
  };

  return {
    ...lip,
    contractor,
    insured,
  };
}

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
      updateLipCache<Lip>(queryClient, lipId, (lip) =>
        applyContractorIdentification(lip, identityDocument),
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
      updateLipCache<LipWithContractorIdentification>(
        queryClient,
        lipId,
        (oldLip) => ({
          ...oldLip,
          den: lip.den,
        }),
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
      updateLipCache<Lip>(queryClient, lipId, (oldLip) => ({
        ...oldLip,
        insured: lip.insured,
        contractorInsuredRelationship: lip.contractorInsuredRelationship,
        contractorInsuredRelationshipOther:
          lip.contractorInsuredRelationshipOther,
      }));
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
      updateLipCache<LipWithInsuredData>(queryClient, lipId, (lip) => ({
        ...lip,
        insured: {
          ...lip.insured,
          identityDocument: [identityDocument],
        },
      }));
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
      updateLipCache<Lip>(queryClient, lipId, (oldLip) => ({
        ...oldLip,
        ...lip,
      }));
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
      updateLipCache<Lip>(queryClient, lipId, (oldLip) => ({
        ...oldLip,
        ...lip,
      }));
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
      updateLipCache<Lip>(queryClient, lipId, (oldLip) => ({
        ...oldLip,
        ...lip,
      }));
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
      updateLipCache<Lip>(queryClient, lipId, (oldLip) => ({
        ...oldLip,
        ...lip,
      }));
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
      updateLipCache<Lip>(queryClient, lipId, (oldLip) => ({
        ...oldLip,
        ...lip,
      }));
    },
  });
};
