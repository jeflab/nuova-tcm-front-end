"use client";

import {ContractorPersonalAreaActivationLastPrivacyForm} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/ContractorPersonalAreaActivationLastPrivacyForm";
import {Suspense} from "react";
import {ModalBody} from "react-bootstrap";

export function ContractorPersonalAreaActivationModalContent() {
  return (
    <ModalBody>
      <h3 className="mb-4">
        <strong>Consensi per l'uso della piattaforma</strong>
      </h3>
      <Suspense fallback={<div>Loading...</div>}>
        <ContractorPersonalAreaActivationLastPrivacyForm />
      </Suspense>
    </ModalBody>
  );
}
