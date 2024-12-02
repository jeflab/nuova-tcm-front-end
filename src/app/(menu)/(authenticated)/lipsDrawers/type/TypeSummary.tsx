"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {faTriangleExclamation} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert} from "react-bootstrap";

export function TypeSummary() {
  const typePreliminary = useStore((state) => state.preliminaryData.type);

  const type = useStore((state) => state.lip?.type);

  const lipType = type ?? typePreliminary;

  if (lipType === "self-insured") {
    return (
      <>
        <p>Il Contraente e l'assicurato coincidono</p>
        <Alert variant="info" className="mb-0">
          <h3>
            <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
            Avviso legale: Contraente e Assicurato devono coincidere.
          </h3>
          <p>
            Ai fini legali, è obbligatorio che il Contraente coincida con
            l'assicurato durante la compilazione dei dati.
          </p>
          <p className="mb-0">
            Il Contraente è la persona responsabile della sottoscrizione della
            polizza, mentre l'assicurato è la persona per la quale la polizza
            viene stipulata. Affinché il processo sia conforme alle normative
            vigenti, i dettagli del Contraente e dell'assicurato devono
            corrispondere.
          </p>
        </Alert>
      </>
    );
  }

  if (lipType === "third-party-insured") {
    return (
      <>
        <p>Il Contraente è diverso dall'assicurato</p>
        <Alert variant="info" className="mb-0">
          <h3>
            <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
            Avviso legale: Contraente e Assicurato sono diversi.
          </h3>
          <p>
            Ai fini legali, è obbligatorio che il Contraente e l'Assicurato
            siano persone diverse durante la compilazione dei dati.
          </p>
          <p className="mb-0">
            Il Contraente è la persona responsabile della sottoscrizione della
            polizza, mentre l'Assicurato è la persona per la quale la polizza
            viene stipulata. Affinché il processo sia conforme alle normative
            vigenti, i dettagli del Contraente e dell'Assicurato devono essere
            diversi.
          </p>
        </Alert>
      </>
    );
  }

  return null;
}
