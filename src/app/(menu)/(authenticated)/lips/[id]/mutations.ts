import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createRecurringPayment} from "./actions";
import {normalizeError} from "@/helpers/errors";

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
