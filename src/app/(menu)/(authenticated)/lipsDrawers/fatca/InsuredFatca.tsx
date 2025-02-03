"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {faCheck, faXmark} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function InsuredFatca() {
  const insuredFatcaPreliminary = useStore(
    (state) => state.preliminaryData.insuredFatca,
  );
  const insuredResidencyPreliminary = useStore(
    (state) => state.preliminaryData.insuredItalianResidency,
  );

  const insuredFatcaLip = useStore(
    (state) => state.lip?.insured?.fatca.fatcaCheck.response,
  );
  const insuredResidencyLip = useStore(
    (state) => state.lip?.insured?.fatca.residencyCheck.response,
  );

  const insuredFatcaData = insuredFatcaLip ?? insuredFatcaPreliminary;
  const insuredResidencyData =
    insuredResidencyLip ?? insuredResidencyPreliminary;

  if (insuredFatcaData === "yes") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faXmark} className="text-danger" fixedWidth />{" "}
        Non è possibile continuare la consulenza poiché l'Assicurato è residente
        negli Stati Uniti d'America.
      </p>
    );
  }
  if (insuredResidencyData === "no") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faXmark} className="text-danger" fixedWidth />{" "}
        Non è possibile continuare la consulenza poiché l'Assicurato non è
        residente in Italia.
      </p>
    );
  }
  if (insuredFatcaData === "no" && insuredResidencyData === "yes") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth />{" "}
        L'Assicurato è residente in Italia e non è residente negli Stati Uniti
        d'America
      </p>
    );
  }

  return null;
}
