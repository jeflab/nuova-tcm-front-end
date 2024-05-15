"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {backendUrl} from "@/services/const";
import {ButtonLink} from "@/ui/ButtonLink";
import {Decimal} from "@/ui/Currency";
import {faDownload} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert} from "react-bootstrap";

const professionalSportQuestionnaireUrl =
  backendUrl + "questionario_professionale_sportivo.pdf";

export function HealthQuestionnaireSummary() {
  const healthQuestionnaireData = useDrawerStore(
    (state) => state.lip?.healthcareQuestionnaire,
  );

  if (!healthQuestionnaireData) {
    return null;
  }

  const showProfessionalSportQuestionnaire =
    healthQuestionnaireData.professionalRisk.check === "yes" ||
    healthQuestionnaireData.sportRisk.check === "yes";

  return (
    <>
      <p>
        L'indice di massa corporea dell'assicurato è di{" "}
        <Decimal>{healthQuestionnaireData.IMC}</Decimal>.
      </p>
      {showProfessionalSportQuestionnaire && (
        <Alert variant="info" className="mb-0">
          <p>
            In virtù delle risposte fornite nella compilazione del questionario
            sanitario, il Contraente è tenuto alla compilazione del seguente
            questionario aggiuntivo.
          </p>
          <ButtonLink href={professionalSportQuestionnaireUrl} download>
            <FontAwesomeIcon icon={faDownload} /> Scarica il questionario
            professionale sportivo
          </ButtonLink>
        </Alert>
      )}
    </>
  );
}
