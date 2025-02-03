"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {faUser, faUserGroupSimple} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function TypeSummary() {
  const typePreliminary = useStore((state) => state.preliminaryData.type);

  const type = useStore((state) => state.lip?.type);

  const lipType = type ?? typePreliminary;

  if (lipType === "self-insured") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faUser} fixedWidth className="text-primary" /> Il
        Contraente e l'assicurato coincidono
      </p>
    );
  }

  if (lipType === "third-party-insured") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon
          icon={faUserGroupSimple}
          fixedWidth
          className="text-primary"
        />{" "}
        Il Contraente è diverso dall'assicurato
      </p>
    );
  }

  return null;
}
