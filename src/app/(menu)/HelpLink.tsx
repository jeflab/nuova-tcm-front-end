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
  const subject = `Richiesta d'assistenza da ${fiscalCode}`;
  const mailBody = `Non modificare questa sezione:
  ---
  Versione applicazione: ${appVersion}
  Url della richiesta: ${pathName}
  ---

  Inserisci qui la tua richiesta, specificando il numero della proposta, il contraente a cui ci si riferisce e allegando a questa e-mail eventuali schermate di errore.`;

  return (
    <Link
      className={className}
      href={`mailto:${helpEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`}
    >
      {label ?? helpEmail}
    </Link>
  );
}
