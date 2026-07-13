import "server-only";

import {headers} from "next/headers";

/**
 * IP reale del browser, letto dagli header impostati dal proxy/edge (es.
 * Vercel) davanti al server Next. Da chiamare solo in un contesto server
 * (server action, route handler, ecc.).
 */
export async function getClientIp() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    return (firstIp ?? forwardedFor).trim();
  }

  return headersList.get("x-real-ip") ?? undefined;
}
