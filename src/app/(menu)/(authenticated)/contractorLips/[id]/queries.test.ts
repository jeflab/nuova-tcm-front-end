import {beforeEach, describe, expect, test, vi} from "vitest";

const {get} = vi.hoisted(() => ({get: vi.fn()}));

vi.mock("@/services/api", () => ({
  get,
  patch: vi.fn(),
  post: vi.fn(),
}));

import {getContractorLipQuery} from "./queries";

/**
 * Come il back-end rifiuta una polizza che non è del Contraente, che non esiste,
 * o qualunque polizza se il Contraente non ha un'anagrafica collegata: le tre
 * risposte sono indistinguibili per scelta, così il rifiuto non dice a nessuno
 * quali polizze esistano.
 */
const refusal = {
  status: "failed",
  message: "Nessuna polizza trovata",
  responseStatus: 404,
};

function isNotFoundPage(error: unknown): boolean {
  return (
    (error as {digest?: string})?.digest === "NEXT_HTTP_ERROR_FALLBACK;404"
  );
}

describe("la polizza che il Contraente non può leggere", () => {
  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue(refusal);
  });

  test('porta alla pagina "non trovata" dell\'app', async () => {
    const {queryFn} = getContractorLipQuery(42);
    if (typeof queryFn !== "function") {
      throw new Error("La query della polizza deve avere una queryFn");
    }

    await expect(queryFn({} as never)).rejects.toSatisfy(isNotFoundPage);
  });
});
