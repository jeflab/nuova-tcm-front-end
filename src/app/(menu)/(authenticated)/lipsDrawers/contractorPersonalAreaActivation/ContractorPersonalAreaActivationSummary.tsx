"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {faDownload} from "@fortawesome/pro-duotone-svg-icons";
import {faCheck} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Stack} from "react-bootstrap";

const emptyObject = {};

export function ContractorPersonalAreaActivationSummary() {
  const lipId = useStore((state) => state.lip?.id);
  const agentId = useStore((state) => state.lip?.agent.id);
  const contractor = useStore((state) => state.lip?.contractor);
  const documents = useStore((state) => state.lip?.documents ?? emptyObject);

  if (!contractor) {
    return null;
  }

  if (contractor.lastPrivacyESignId === null) {
    return null;
  }

  return (
    <Stack gap={4}>
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth />{" "}
        Area Contraente attivata
      </p>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faDownload} /> Documenti preliminari
      </h4>
      {lipId && agentId && (
        <Stack direction="horizontal" gap={2} className="flex-wrap">
          <DownloadDocumentButton
            uri="pdf-privacy"
            lipId={lipId}
            agentId={agentId}
            contractorId={contractor.id}
          >
            Privacy e consensi
          </DownloadDocumentButton>
          {"fileAllegato3" in documents && (
            <DownloadDocumentButton
              uri="pdf-allegato3"
              lipId={lipId}
              agentId={agentId}
            >
              Allegato 3
            </DownloadDocumentButton>
          )}
          {"fileAllegato4TER" in documents && (
            <DownloadDocumentButton
              uri="pdf-allegato4ter"
              lipId={lipId}
              agentId={agentId}
            >
              Allegato 4 TER
            </DownloadDocumentButton>
          )}
          {"fileElencoCompagnie" in documents && (
            <DownloadDocumentButton
              uri="pdf-elenco-compagnie"
              lipId={lipId}
              agentId={agentId}
            >
              Elenco compagnie
            </DownloadDocumentButton>
          )}
        </Stack>
      )}
    </Stack>
  );
}
