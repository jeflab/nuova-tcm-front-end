"use client";

import {dateString} from "@/helpers/dates";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {faFileCertificate} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useStore} from "../../lips/[id]/store";

export function CertificateSummary() {
  const lipId = useStore((state) => state.lip?.id);
  const agentId = useStore((state) => state.lip?.agent?.id);
  const certificateState = useStore((state) => state.drawerStates.certificate);
  const certificate = useStore((state) => state.lip?.certificate);

  if (!lipId || !agentId || !certificateState) {
    return null;
  }

  if (certificateState.variant === "waiting") {
    return (
      <>
        <h4 className="w-100 text-primary">
          <FontAwesomeIcon icon={faFileCertificate} /> Certificato
        </h4>
        <p className="mb-0">In attesa di generazione del certificato</p>
      </>
    );
  }

  return (
    <>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faFileCertificate} /> Certificato
      </h4>
      <p>
        <strong>Data di decorrenza:</strong>{" "}
        {dateString(certificate?.effectiveDate)}
      </p>
      <div>
        <DownloadDocumentButton
          uri="pdf-certificato"
          lipId={lipId}
          agentId={agentId}
        >
          Scarica certificato di polizza
        </DownloadDocumentButton>
      </div>
    </>
  );
}
