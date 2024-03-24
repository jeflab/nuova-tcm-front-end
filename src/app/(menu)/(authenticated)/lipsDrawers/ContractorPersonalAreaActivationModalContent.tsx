"use client";

import {ContractorPersonalAreaActivationForm} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorPersonalAreaActivationForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {ReactNode, Suspense} from "react";
import {ModalBody} from "react-bootstrap";

interface ContractorPersonalAreaActivationModalContentProps {
  lastPrivacy: ReactNode;
}

export function ContractorPersonalAreaActivationModalContent({
  lastPrivacy,
}: ContractorPersonalAreaActivationModalContentProps) {
  const drawerState = useDrawerStore(
    (state) => state.drawerStates.contractorPersonalAreaActivation,
  );

  if (drawerState?.variant === "active") {
    return <ContractorPersonalAreaActivationForm />;
  }

  if (drawerState?.variant === "waiting") {
    return (
      <ModalBody>
        <h3 className="mb-4">
          <strong>Consensi per l'uso della piattaforma</strong>
        </h3>
        <Suspense fallback={<div>Loading...</div>}>{lastPrivacy}</Suspense>
      </ModalBody>
    );
  }

  return null;
}
