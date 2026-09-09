import {getLip} from "@/app/(menu)/(authenticated)/contractorLips/[id]/actions";
import {
  LipQueryData,
  lipQueryDataFrom,
} from "@/app/(menu)/(authenticated)/lips/[id]/lipCache";
import {queryOptions} from "@tanstack/react-query";

/**
 * La polizza vista dal Contraente: stessa forma di cache del dettaglio Agente, ma
 * servita da `/contractor-lips/{id}` (`role:SuperAdmin|Contractor`) anziché da
 * `/lips/{id}` (`role:SuperAdmin|Agent`). La chiave è distinta da quella dell'Agente
 * perché i due endpoint rispondono con relazioni diverse sulla stessa polizza.
 */
export function getContractorLipQuery(lipId: number) {
  return queryOptions({
    queryKey: ["contractorLip", lipId],
    queryFn: async (): Promise<LipQueryData> =>
      lipQueryDataFrom(await getLip(lipId)),
  });
}
