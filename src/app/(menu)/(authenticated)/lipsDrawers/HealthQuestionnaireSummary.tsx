"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {calculateImc, RANGE} from "./imc";

export function HealthQuestionnaireSummary() {
  const healthQuestionnaireData = useDrawerStore(
    (state) => state.lip?.healthcareQuestionnaire,
  );

  if (!healthQuestionnaireData) {
    return null;
  }

  const imc = calculateImc(
    parseInt(healthQuestionnaireData?.weight, 10),
    parseInt(healthQuestionnaireData?.height, 10),
  );

  return (
    <p className="mb-0">
      L'indice di massa corporea dell'assicurato è di {imc.toFixed(2)}.
    </p>
  );
}
