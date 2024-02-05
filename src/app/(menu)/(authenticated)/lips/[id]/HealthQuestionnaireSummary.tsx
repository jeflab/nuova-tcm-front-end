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
        di non stare bene o di avere una patologia o malattia.
      </p>
    );
  }

  if (healthQuestionnaireData?.feelingGood) {
    return (
      <p className="mb-0">
        Il contraente dichiara di stare bene e di non avere alcuna patologia o
        malattia.
      </p>
    );
  }

  return null;
}
