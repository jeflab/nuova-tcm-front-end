"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {imcInRange} from "@/helpers/imc";
import {Decimal} from "@/ui/Currency";
import {faCheck} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Stack} from "react-bootstrap";

export function HealthQuestionnaireSummary() {
  const healthQuestionnaireData = useStore(
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

  return (
    <Stack gap={3}>
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth />{" "}
        L'indice di massa corporea dell'assicurato è di{" "}
        <Decimal>{healthQuestionnaireData.IMC}</Decimal>.
      </p>
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
