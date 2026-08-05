import "server-only";

import {headers} from "next/headers";

/**
 * User-Agent reale del browser, letto dagli header della richiesta in
 * ingresso al server Next. Da chiamare solo in un contesto server (server
 * action, route handler, ecc.).
 */
export async function getClientUserAgent() {
  const headersList = await headers();
  return headersList.get("user-agent") ?? undefined;
}
