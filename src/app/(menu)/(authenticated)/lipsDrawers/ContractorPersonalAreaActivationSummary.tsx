"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {apiUrl} from "@/services/const";
import {ButtonLink} from "@/ui/ButtonLink";
import {faDownload} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Stack} from "react-bootstrap";

export function ContractorPersonalAreaActivationSummary() {
  const lipId = useDrawerStore((state) => state.lip?.id);
  const agentId = useDrawerStore((state) => state.lip?.agent.id);
  const contractor = useDrawerStore((state) => state.lip?.contractor);

  if (!contractor) {
    return null;
  }

  if (contractor.lastPrivacyEsignId === null) {
    return (
      <p className="mb-0">
        In attesa che il Contraente accetti e firmi la privacy
      </p>
    );
  }

  return (
    <Stack gap={4}>
      <p className="mb-0">Area Contraente attivata</p>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faDownload} /> Documenti preliminari
      </h4>
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <ButtonLink
          href={`${apiUrl}/pdf-privacy?lipId=${lipId}&agentId=${agentId}&contractorId=${contractor.id}`}
          download
        >
          <FontAwesomeIcon icon={faDownload} /> Privacy e consensi
        </ButtonLink>
        <ButtonLink
          href={`${apiUrl}/${lipId}/pdf-allegato3?lipId=${lipId}&agentId=${agentId}`}
          download
        >
          <FontAwesomeIcon icon={faDownload} /> Allegato 3
        </ButtonLink>
        <ButtonLink
          href={`${apiUrl}/${lipId}/pdf-allegato4ter?lipId=${lipId}&agentId=${agentId}`}
          download
        >
          <FontAwesomeIcon icon={faDownload} /> Allegato 4 TER
        </ButtonLink>
        <ButtonLink
          href={`${apiUrl}/${lipId}/pdf-elenco-compagnie?lipId=${lipId}&agentId=${agentId}`}
          download
        >
          <FontAwesomeIcon icon={faDownload} /> Elenco compagnie
        </ButtonLink>
      </Stack>
    </Stack>
  );
}
