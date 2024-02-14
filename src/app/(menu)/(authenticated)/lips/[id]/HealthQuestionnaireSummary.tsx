"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {calculateImc} from "./imc";

export function HealthQuestionnaireSummary() {
  const healthQuestionnaireData = useDrawerStore(
    (state) => state.lipData.healthQuestionnaire,
  );

  if (!healthQuestionnaireData) {
    return null;
  }

  const imc = calculateImc(
    parseInt(healthQuestionnaireData?.weight, 10),
    parseInt(healthQuestionnaireData?.height, 10),
  );

  if (imc > 30 || imc < 18.5) {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché l'indice di massa
        corporea dell'assicurato è al di fuori dei limiti accettabili.
      </p>
    );
  }

  return (
    <p className="mb-0">
      L'indice di massa corporea dell'assicurato è di {imc.toFixed(2)}.
    </p>
  );
}
