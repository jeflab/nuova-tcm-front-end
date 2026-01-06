"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {faCheck, faXmark} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

export function ContractorFatca() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (lip.contractor?.fatca?.fatcaCheck.response === "yes") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faXmark} className="text-danger" fixedWidth />{" "}
        Non è possibile continuare la consulenza poiché il Contraente è
        residente negli Stati Uniti d'America.
      </p>
    );
  }
  if (lip.contractor?.fatca?.residencyCheck.response === "no") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faXmark} className="text-danger" fixedWidth />{" "}
        Non è possibile continuare la consulenza poiché il Contraente non è
        residente in Italia.
      </p>
    );
  }
  if (
    lip.contractor?.fatca?.fatcaCheck.response === "no" &&
    lip.contractor?.fatca?.residencyCheck.response === "yes"
  ) {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth />{" "}
        Il Contraente è residente in Italia e non è residente negli Stati Uniti
        d'America
      </p>
    );
  }

  return null;
}
