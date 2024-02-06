"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";

export function HealthQuestionnaireSummary() {
  const healthQuestionnaireData = useDrawerStore(
    (state) => state.lipData.healthQuestionnaire,
  );

  if (healthQuestionnaireData?.feelingGood === false) {
    return (
      <p className="mb-0">
        Non è possibile continuare la consulenza poiché il contraente dichiara
        che l'assicurato non sta bene e ha delle patologie o malattie.
      </p>
    );
  }

  if (healthQuestionnaireData?.feelingGood) {
    return (
      <p className="mb-0">
        Il contraente dichiara che l'assicurato sta bene e non ha alcuna
        patologia o malattia.
      </p>
    );
  }

  return null;
}
