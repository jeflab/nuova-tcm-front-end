import {readdirSync, readFileSync, statSync} from "node:fs";
import {join} from "node:path";
import {beforeEach, describe, expect, test, vi} from "vitest";

const {get} = vi.hoisted(() => ({get: vi.fn()}));

vi.mock("@/services/api", () => ({
  get,
  patch: vi.fn(),
  post: vi.fn(),
}));

import {lipAudienceFor, lipQueryFor} from "./lipQuery";

function fetchLipFrom(pathname: string, lipId: number) {
  const {queryFn} = lipQueryFor(lipAudienceFor(pathname), lipId);
  if (typeof queryFn !== "function") {
    throw new Error("La query della polizza deve avere una queryFn");
  }
  return queryFn({} as never);
}

describe("da quale endpoint arriva la polizza del dettaglio", () => {
  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue({status: "success", lip: {}});
  });

  test("dal portale del Contraente, dall'endpoint del contraente", async () => {
    await fetchLipFrom("/contractorLips/42", 42);

    expect(get).toHaveBeenCalledWith("/contractor-lips/42", expect.anything());
  });

  test("dal portale dell'Agente, dal proprio endpoint di sempre", async () => {
    await fetchLipFrom("/lips/42", 42);

    expect(get).toHaveBeenCalledWith("/lips/42", expect.anything());
  });

  test("le due viste non condividono la chiave di cache della stessa polizza", () => {
    expect(lipQueryFor("contractor", 42).queryKey).not.toEqual(
      lipQueryFor("agent", 42).queryKey,
    );
  });
});

describe("lipAudienceFor", () => {
  test("il percorso delle polizze del contraente è il portale del Contraente", () => {
    expect(lipAudienceFor("/contractorLips/42")).toBe("contractor");
  });

  test("ogni altro percorso resta il portale dell'Agente", () => {
    expect(lipAudienceFor("/lips/42")).toBe("agent");
    expect(lipAudienceFor("/lips/new")).toBe("agent");
  });
});

const srcRoot = join(import.meta.dirname, "..", "..", "..", "..");

function sourceFilesUnder(...segments: string[]): string[] {
  const root = join(srcRoot, ...segments);
  const entries = readdirSync(root).map((entry) => join(root, entry));

  return entries.flatMap((entry) =>
    statSync(entry).isDirectory()
      ? sourceFilesUnder(entry.slice(srcRoot.length + 1))
      : /(?<!\.test)\.tsx?$/.test(entry)
        ? [entry]
        : [],
  );
}

function filesUsingAgentLipQuery(files: string[]): string[] {
  return files
    .filter((file) => readFileSync(file, "utf8").includes("getLipQuery"))
    .map((file) => file.slice(srcRoot.length + 1).replaceAll("\\", "/"));
}

describe("nessuna vista del Contraente passa dalla query dell'Agente", () => {
  test("la vista di dettaglio del Contraente non usa la query dell'Agente", () => {
    const files = sourceFilesUnder(
      "app",
      "(menu)",
      "(authenticated)",
      "contractorLips",
    );

    expect(filesUsingAgentLipQuery(files)).toEqual([]);
  });

  test("i componenti condivisi dei drawer non usano la query dell'Agente", () => {
    const files = [
      ...sourceFilesUnder("app", "(menu)", "(authenticated)", "lipsDrawers"),
      ...sourceFilesUnder("ui", "drawer"),
    ].filter((file) => !file.endsWith("lipQuery.ts"));

    expect(filesUsingAgentLipQuery(files)).toEqual([]);
  });
});
