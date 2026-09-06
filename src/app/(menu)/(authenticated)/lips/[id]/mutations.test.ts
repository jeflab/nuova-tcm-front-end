import {Lip} from "@/models/entities/lip";
import {describe, expect, test} from "vitest";
import {applyContractorIdentification} from "./mutations";

function buildLip(overrides: Record<string, unknown> = {}): Lip {
  return {
    type: "self-insured",
    contractor: {identityDocument: undefined},
    insured: {identityDocument: undefined},
    ...overrides,
  } as unknown as Lip;
}

describe("applyContractorIdentification", () => {
  test("per una lip self-insured, il documento del contraente viene rispecchiato anche sull'assicurato", () => {
    const lip = buildLip({type: "self-insured"});
    const identityDocument = {idType: "identity_card", number: "AB1234567"};

    const updatedLip = applyContractorIdentification(
      lip,
      identityDocument as never,
    );

    expect(updatedLip.contractor.identityDocument).toEqual([identityDocument]);
    expect(updatedLip.insured?.identityDocument).toEqual([identityDocument]);
  });

  test("per una lip third-party-insured, l'assicurato non viene toccato", () => {
    const lip = buildLip({
      type: "third-party-insured",
      insured: {identityDocument: undefined},
    });
    const identityDocument = {idType: "identity_card", number: "AB1234567"};

    const updatedLip = applyContractorIdentification(
      lip,
      identityDocument as never,
    );

    expect(updatedLip.contractor.identityDocument).toEqual([identityDocument]);
    expect(updatedLip.insured?.identityDocument).toBeUndefined();
  });
});
