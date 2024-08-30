"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {faAddressBook} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function ContractorContactsSummary() {
  const contractor = useDrawerStore((state) => state.lip?.contractor);

  if (!contractor) {
    return null;
  }

  return (
    <>
      <h4 className="w-100 text-primary">
        <FontAwesomeIcon icon={faAddressBook} /> Contatti
      </h4>
      <p className="mb-0">
        <strong>Telefono:</strong> {contractor.phone}
      </p>
      <p className="mb-0">
        <strong>Email:</strong> {contractor.email}
      </p>
    </>
  );
}
