"use client";

import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {isLip} from "@/models/entities/lip";
import {faCheck, faXmark} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function InsuredFatca() {
  const {
    data: {lip},
  } = useSuspenseLip();
  if (lip.insured?.fatca?.fatcaCheck.response === "yes") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faXmark} className="text-danger" fixedWidth />{" "}
        Non è possibile continuare la consulenza poiché l'Assicurato è residente
        negli Stati Uniti d'America.
      </p>
    );
  }
  if (lip.insured?.fatca?.residencyCheck.response === "no") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faXmark} className="text-danger" fixedWidth />{" "}
        Non è possibile continuare la consulenza poiché l'Assicurato non è
        residente in Italia.
      </p>
    );
  }
  if (
    isLip(lip) ||
    (lip.insured?.fatca?.fatcaCheck.response === "no" &&
      lip.insured?.fatca?.residencyCheck.response === "yes")
  ) {
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
