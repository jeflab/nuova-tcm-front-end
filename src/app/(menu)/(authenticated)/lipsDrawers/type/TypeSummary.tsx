"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  LipSalesMode,
  LipType,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
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
  const typePreliminary = useStore((state) => state.preliminaryData.type);
  const salesModePreliminary = useStore(
    (state) => state.preliminaryData.salesMode,
  );

  const type = useStore((state) => state.lip?.type);
  const salesMode = useStore((state) => state.lip?.salesMode);

  const lipType = type ?? typePreliminary;
  const lipSalesMode = salesMode ?? salesModePreliminary;

  return lipType && lipSalesMode ? (
    <>
      <LipTypeSummary lipType={lipType} />
      <LipSalesModeSummary lipSalesMode={lipSalesMode} />
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
