"use client";

import {ReactNode, Suspense} from "react";
import {ModalBody} from "react-bootstrap";

interface ContractorPersonalAreaActivationModalContentProps {
  lastPrivacy: ReactNode;
}

export function ContractorPersonalAreaActivationModalContent({
  lastPrivacy,
}: ContractorPersonalAreaActivationModalContentProps) {
  return (
    <ModalBody>
      <h3 className="mb-4">
        <strong>Consensi per l'uso della piattaforma</strong>
      </h3>
      <Suspense fallback={<div>Loading...</div>}>{lastPrivacy}</Suspense>
    </ModalBody>
  );
}
