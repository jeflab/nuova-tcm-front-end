import {
  isDocumentsValid,
  LipWithDocuments,
} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/documentsValidators";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";

export type LipWithCertificate = LipWithDocuments & {
  certificate: NonNullable<Lip["certificate"]>;
};
export function isCertificateValid(
  lip: Lip | PreliminaryData | null,
): lip is LipWithCertificate {
  if (!isDocumentsValid(lip)) {
    return false;
  }

  return !!lip?.certificate;
}
