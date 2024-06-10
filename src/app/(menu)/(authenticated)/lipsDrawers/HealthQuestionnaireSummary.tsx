"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {imcInRange} from "@/helpers/imc";
import {backendUrl} from "@/services/const";
import {ButtonLink} from "@/ui/ButtonLink";
import {Decimal} from "@/ui/Currency";
import {faDownload} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Stack} from "react-bootstrap";

const professionalSportQuestionnaireUrl =
  backendUrl + "questionario_professionale_sportivo.pdf";

export function HealthQuestionnaireSummary() {
  const healthQuestionnaireData = useDrawerStore(
    (state) => state.lip?.healthcareQuestionnaire,
  );

  if (!healthQuestionnaireData) {
    return null;
  }

  const oneYesInHealthcareQuestionnaire = Object.values(
    healthQuestionnaireData ?? {},
  ).some(
    (question) => typeof question === "object" && question.check === "yes",
  );
  const isImcInRange = imcInRange(
    parseInt(healthQuestionnaireData.weight, 10),
    parseInt(healthQuestionnaireData.height, 10),
  );

  const showProfessionalSportQuestionnaire =
    healthQuestionnaireData.professionalRisk.check === "yes" ||
    healthQuestionnaireData.sportRisk.check === "yes";

  return (
    <Stack gap={3}>
      <p className="mb-0">
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
          <ButtonLink
            href={professionalSportQuestionnaireUrl}
            download
            target="_blank"
          >
            <FontAwesomeIcon icon={faDownload} /> Scarica i questionari per il
            rischio professionale e sportivo
          </ButtonLink>
        </Alert>
      )}
      {(oneYesInHealthcareQuestionnaire || !isImcInRange) && (
        <Alert variant="warning" className="mb-0">
          In virtù delle risposte fornite nella compilazione del questionario
          sanitario la proposta di Polizza sarà soggetta ad ulteriori
          approfondimenti.
        </Alert>
      )}
    </Stack>
  );
}
