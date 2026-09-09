"use client";

import {isHealthcareQuestionnaireValid} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/healthQuestionnaireValidators";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {imcInRange} from "@/helpers/imc";
import {Decimal} from "@/ui/Currency";
import {faCheck} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Stack} from "react-bootstrap";

export function HealthQuestionnaireSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

  if (!isHealthcareQuestionnaireValid(lip)) {
    return null;
  }

  const oneYesInHealthcareQuestionnaire = Object.values(
    lip.healthcareQuestionnaire ?? {},
  ).some(
    (question) => typeof question === "object" && question.check === "yes",
  );
  const isImcInRange = imcInRange(
    parseInt(lip.healthcareQuestionnaire.weight, 10),
    parseInt(lip.healthcareQuestionnaire.height, 10),
  );

  return (
    <Stack gap={3}>
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth />{" "}
        L'indice di massa corporea dell'assicurato è di{" "}
        <Decimal>{lip.healthcareQuestionnaire.IMC}</Decimal>.
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
