import {getContractorLipQuery} from "@/app/(menu)/(authenticated)/contractorLips/[id]/queries";
import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {notFound} from "next/navigation";

/**
 * Da quale portale si sta guardando la polizza. I due portali chiamano endpoint
 * diversi, protetti da ruoli diversi: l'Agente `/lips/{id}`, il Contraente
 * `/contractor-lips/{id}`.
 */
export type LipAudience = "agent" | "contractor";

const contractorPortalPath = "/contractorLips";

/**
 * Il portale si legge dal percorso, come il numero della polizza: è la URL a dire in
 * quale delle due viste siamo, quindi non serve tenerne una seconda copia altrove che
 * qualcuno possa dimenticare di aggiornare.
 */
export function lipAudienceFor(pathname: string): LipAudience {
  return pathname.startsWith(contractorPortalPath) ? "contractor" : "agent";
}

/**
 * L'unico punto in cui si decide quale endpoint serve la polizza. Lo usano sia il
 * precaricamento nella pagina (server) sia la lettura nei componenti (client), così
 * le due strade non possono divergere sulla chiave di cache.
 *
 * Le due chiavi sono distinte fra i portali: la stessa polizza letta dai due
 * endpoint non porta le stesse relazioni, quindi una risposta non può essere riusata
 * per l'altra vista.
 */
export function lipQueryFor(audience: LipAudience, lipId: "new" | number) {
  if (audience === "agent") {
    return getLipQuery(lipId);
  }

  if (lipId === "new") {
    // Il Contraente non compila proposte: non esiste una bozza da aprire per lui.
    notFound();
  }

  return getContractorLipQuery(lipId);
}
