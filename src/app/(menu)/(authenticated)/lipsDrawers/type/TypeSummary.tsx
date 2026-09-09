"use client";

import {
  LipSalesMode,
  LipType,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {
  faBuilding,
  faHandshake,
  faLaptopMobile,
  faUser,
  faUserGroupSimple,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface LipTypeSummaryProps {
  lipType: LipType;
}
interface LipSalesModeSummaryProps {
  lipSalesMode: LipSalesMode;
}

export function TypeSummary() {
  const {
    data: {lip},
  } = useSuspenseLip();

  return lip.type && lip.salesMode ? (
    <>
      <LipTypeSummary lipType={lip.type} />
      <LipSalesModeSummary lipSalesMode={lip.salesMode} />
    </>
  ) : null;
}

function LipTypeSummary({lipType}: LipTypeSummaryProps) {
  return lipType === "self-insured" ? (
    <p className="mb-0">
      <FontAwesomeIcon icon={faUser} fixedWidth className="text-primary" /> Il
      Contraente e l'assicurato coincidono
    </p>
  ) : lipType === "third-party-insured" ? (
    <p className="mb-0">
      <FontAwesomeIcon
        icon={faUserGroupSimple}
        fixedWidth
        className="text-primary"
      />{" "}
      Il Contraente è diverso dall'Assicurato
    </p>
  ) : lipType === "corporate-insured" ? (
    <p className="mb-0">
      <FontAwesomeIcon icon={faBuilding} fixedWidth className="text-primary" />{" "}
      Il Contraente è una Persona Giuridica
    </p>
  ) : null;
}

function LipSalesModeSummary({lipSalesMode}: LipSalesModeSummaryProps) {
  return lipSalesMode === "in-person" ? (
    <p className="mb-0">
      <FontAwesomeIcon icon={faHandshake} fixedWidth className="text-primary" />{" "}
      La vendita è in presenza
    </p>
  ) : lipSalesMode === "remote" ? (
    <p className="mb-0">
      <FontAwesomeIcon
        icon={faLaptopMobile}
        fixedWidth
        className="text-primary"
      />{" "}
      La vendita è a distanza
    </p>
  ) : null;
}
