"use client";

import {isCertificateValid} from "@/app/(menu)/(authenticated)/lipsDrawers/certificate/certificateValidators";
import {isDocumentsValid} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {dateString} from "@/helpers/dates";
import {DownloadDocumentButton} from "@/ui/DownloadDocumentButton";
import {faFileCertificate} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useParams} from "next/navigation";

export function CertificateSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isDocumentsValid(lip)) {
    return null;
  }

  if (!isCertificateValid(lip)) {
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
        {dateString(lip.certificate.effectiveDate)}
      </p>
      <div>
        <DownloadDocumentButton
          uri="pdf-certificato"
          lipId={lipId}
          agentId={lip.agent.id}
        >
          Scarica certificato di polizza
        </DownloadDocumentButton>
      </div>
    </>
  );
}
