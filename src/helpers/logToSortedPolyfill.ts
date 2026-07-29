import * as Sentry from "@sentry/nextjs";

// Controllo se il metodo nativo manca prima che intervenga qualsiasi polyfill
// Usa 'as any' per evitare errori TS se la lib del progetto non include ancora toSorted
if (!Array.prototype.toSorted) {
  Sentry.captureMessage(
    "[].toSorted non è supportato nativamente in questo ambiente, applicando polyfill",
  );
}
