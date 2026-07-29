"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {isLip} from "@/models/entities/lip";
import {faAddressBook} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

export function ContractorContactsSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isLip(lip)) {
    return null;
  }

  return (
    <>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faAddressBook} /> Contatti
      </h4>
      <p className="mb-0">
        <strong>Telefono:</strong> {lip.contractor.phone}
      </p>
      <p className="mb-0">
        <strong>E-Mail:</strong> {lip.contractor.email}
      </p>
    </>
  );
}
