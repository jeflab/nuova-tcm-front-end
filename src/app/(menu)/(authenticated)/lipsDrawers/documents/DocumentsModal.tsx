"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {CompanyPrivacy} from "@/app/(menu)/(authenticated)/lipsDrawers/CompanyPrivacy";
import {DocumentsManagement} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsManagement";

export function DocumentsModal() {
  const lip = useDrawerStore((state) => state.lip);

  if (!lip) return null;

  if (!lip.privacyCompany) {
    return (
      <CompanyPrivacy
        lipId={lip.id}
        agentId={lip.agent.id}
        contractorId={lip.contractor.id}
      />
    );
  } else {
    return <DocumentsManagement />;
  }
}
