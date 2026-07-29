"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {isContractorPersonalAreaActivationValid} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/contractorPersonalAreaActivationValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {isLip} from "@/models/entities/lip";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {faDownload} from "@fortawesome/pro-duotone-svg-icons";
import {faCheck} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {Stack} from "react-bootstrap";

const emptyObject = {};

export function ContractorPersonalAreaActivationSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isLip(lip)) {
    return null;
  }

  if (!isContractorPersonalAreaActivationValid(lip)) {
    return null;
  }

  const documents = lip.documents || emptyObject;

  return (
    <Stack gap={4}>
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth />{" "}
        Area Contraente attivata
      </p>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faDownload} /> Documenti preliminari
      </h4>
      {lip.id && lip.agent.id && (
        <Stack direction="horizontal" gap={2} className="flex-wrap">
          <DownloadDocumentButton
            uri="pdf-privacy"
            lipId={lipId}
            agentId={lip.agent.id}
            contractorId={lip.contractor.id}
          >
            Privacy e consensi
          </DownloadDocumentButton>
          {"fileMUP" in documents && (
            <DownloadDocumentButton
              uri="pdf-mup"
              lipId={lipId}
              agentId={lip.agent.id}
            >
              Documento precontrattuale
            </DownloadDocumentButton>
          )}
          {"fileAllegato3" in documents && (
            <DownloadDocumentButton
              uri="pdf-allegato3"
              lipId={lipId}
              agentId={lip.agent.id}
            >
              Allegato 3
            </DownloadDocumentButton>
          )}
          {"fileAllegato4TER" in documents && (
            <DownloadDocumentButton
              uri="pdf-allegato4ter"
              lipId={lipId}
              agentId={lip.agent.id}
            >
              Allegato 4 TER
            </DownloadDocumentButton>
          )}
          {"fileElencoCompagnie" in documents && (
            <DownloadDocumentButton
              uri="pdf-elenco-compagnie"
              lipId={lipId}
              agentId={lip.agent.id}
            >
              Elenco compagnie
            </DownloadDocumentButton>
          )}
        </Stack>
      )}
    </Stack>
  );
}
