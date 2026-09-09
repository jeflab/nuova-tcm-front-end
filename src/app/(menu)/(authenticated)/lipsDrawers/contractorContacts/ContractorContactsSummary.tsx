"use client";

import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {isLip} from "@/models/entities/lip";
import {faAddressBook} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function ContractorContactsSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

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
