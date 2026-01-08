"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {amlBlocked} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {Alert} from "react-bootstrap";

export function DocumentsLockAml() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!amlBlocked(lip)) {
    return null;
  }

  return (
    <Alert className="mb-0" variant="danger">
      I dati inseriti richiedono una revisione da parte del nostro backend.
    </Alert>
  );
}
