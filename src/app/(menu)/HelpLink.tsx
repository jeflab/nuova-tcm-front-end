"use client";

import {getVersion} from "@/helpers/release";
import {helpEmail} from "@/services/const";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface HelpLinkProps {
  className?: string;
  fiscalCode?: string;
  label?: string;
}

export function HelpLink({className, fiscalCode, label}: HelpLinkProps) {
  const pathName = usePathname();
  const appVersion = getVersion();
  const mailBody = `Non modificare questa sezione:
  %0D%0A
  ---
  %0D%0A
  Versione applicazione: ${appVersion}
  %0D%0A
  Url della richiesta: ${pathName}
  %0D%0A
  ---
  %0D%0A%0D%0A
  Inserisci qui la tua richiesta, specificando il numero della proposta, il contraente a cui ci si riferisce e allegando a questa email eventuali schermate di errore.`;

  return (
    <Link
      className={className}
      href={`mailto:${helpEmail}?subject=Richiesta d'assistenza da ${fiscalCode}&body=${mailBody}`}
    >
      {label ?? helpEmail}
    </Link>
  );
}
