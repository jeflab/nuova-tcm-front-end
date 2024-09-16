"use client";

import {createDocumentUrl} from "@/helpers/createResourcesUrl";
import {ButtonLink} from "@/ui/ButtonLink";
import {
  faDownload,
  faFileCertificate,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDrawerStore} from "../../lips/[id]/store";

export function CertificateSummary() {
  const lipId = useDrawerStore((state) => state.lip?.id);
  const agentId = useDrawerStore((state) => state.lip?.agent?.id);
  const certificateState = useDrawerStore(
    (state) => state.drawerStates.certificate,
  );

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
        <strong>Data di decorrenza:</strong> 15 gennaio 2025
      </p>
      <div>
        <ButtonLink
          href={createDocumentUrl({
            uri: "pdf-certificato",
            lipId,
            agentId,
          })}
          download
        >
          <FontAwesomeIcon icon={faDownload} /> Scarica certificato di polizza
        </ButtonLink>
      </div>
    </>
  );
}
