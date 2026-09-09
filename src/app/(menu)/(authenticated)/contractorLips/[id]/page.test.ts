import {beforeEach, describe, expect, test, vi} from "vitest";

const {get} = vi.hoisted(() => ({get: vi.fn()}));

vi.mock("@/services/api", () => ({
  get,
  patch: vi.fn(),
  post: vi.fn(),
}));

import ContractorLipPage from "./page";

describe("pagina di dettaglio del Contraente", () => {
  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue({status: "success", lip: {}});
  });

  test("precarica la polizza dall'endpoint del contraente", async () => {
    await ContractorLipPage({params: Promise.resolve({id: "42"})});

    expect(get).toHaveBeenCalledWith("/contractor-lips/42", expect.anything());
  });
});
