"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {CompanyPrivacy} from "@/app/(menu)/(authenticated)/lipsDrawers/CompanyPrivacy";
import {DocumentsManagement} from "@/app/(menu)/(authenticated)/lipsDrawers/DocumentsManagement";

export function DocumentsModal() {
  const lip = useDrawerStore((state) => state.lip);

  if (!lip) return null;

  if (!lip.privacyCompany) {
    return <CompanyPrivacy />;
  } else {
    return <DocumentsManagement />;
  }
}
