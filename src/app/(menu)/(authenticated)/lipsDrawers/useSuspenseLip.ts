"use client";

import {
  lipAudienceFor,
  lipQueryFor,
} from "@/app/(menu)/(authenticated)/lipsDrawers/lipQuery";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams, usePathname} from "next/navigation";

/**
 * La polizza del percorso corrente, con lo stato dei suoi drawer, presa dall'endpoint
 * del portale in cui il componente sta girando. Sospende finché non è caricata.
 */
export function useSuspenseLip() {
  const audience = lipAudienceFor(usePathname());
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);

  return useSuspenseQuery(lipQueryFor(audience, lipId));
}
