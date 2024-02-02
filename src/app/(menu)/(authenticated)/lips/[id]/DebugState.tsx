"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Debug} from "@/ui/Debug";
import React from "react";
import {Card, CardBody, CardHeader} from "react-bootstrap";

const divStyle = {} as const;

useDrawerStore.getState().updateFatca(false);
useDrawerStore.getState().updateContractorFiscalCode({
  birthDate: "1984-06-24",
  birthPlace: {
    city: "Lovere",
    province: "BG",
  },
  fiscalCode: "LZZFBA84H24E704I",
  gender: "M",
  name: "Fabio",
  surname: "Lazzaroni",
});
useDrawerStore.getState().updateLipData({agentId: 2});
useDrawerStore.getState().updateContractorPersonalAreaActivation(true);
useDrawerStore.getState().updateContractorData({
  contractorPersonalData: {
    birthDate: "1984-06-24",
    birthPlace: {
      city: "Lovere",
      province: "BG",
    },
    fiscalCode: "LZZFBA84H24E704I",
    gender: "M",
    name: "Fabio",
    surname: "Lazzaroni",
  },
  contact: {
    phone: "0123456789",
    email: "mail@example.com",
  },
  residence: {
    place: {
      city: "Castelcovati",
      province: "BS",
    },
    streetName: "Via Tito Speri",
    streetNumber: "10",
    zipCode: "25030",
  },
  pep: {
    isPep: "no",
    person: "",
    relation: "",
  },
  aml: {
    job: "Ing",
    sector: "Informatica",
    netIncome: "100000",
    fundSource: "Lavoro",
  },
});
useDrawerStore.getState().updateIdentificationData({
  idType: "identity_card",
  number: "123456",
  issuedBy: "Castelcovati",
  issuedDate: "2022-06-24",
  expiringDate: "2032-06-24",
  frontPicture: "",
  backPicture: "",
  metContractorInPerson: true,
  documentIsCopyShownByContractor: true,
  photoIsOfContractor: true,
  contractorHasBeenIdentified: true,
});
useDrawerStore
  .getState()
  .setPicture(
    "frontPictureUrl",
    "https://v5-dev.prevision.family/api/public/users/9157/get-id-image?id-file-name=20221212143429-front-ci-facsimile-fronte.jpg&size=thumbnail",
  );
useDrawerStore
  .getState()
  .setPicture(
    "backPictureUrl",
    "https://v5-dev.prevision.family/api/public/users/9157/get-id-image?id-file-name=20221212143429-back-ci-facsimile-retro.jpg&size=thumbnail",
  );
useDrawerStore.getState().updateDenData({
  education: "degree",
  job: "self_employed_or_freelancer",
  family: "1",
  dependentFamilyMembers: "0",
  otherInsuranceProducts: "yes",
  needsIntendToMeet: ["investment", "personal_insurance_protection"],
  savings: "1000",
  economicCondition: "stationary",
  expectations: [
    "home_protection",
    "capital_for_heirs",
    "investment",
    "investment_and_capital_protection",
    "protection_against_death_accident_and_illness",
  ],
  // expectations: ["home_protection"], // Expected block
  duration: "multi_year",
  // duration: "1_year", // Expected block
  consistency: ["objective_information", "consistent_with_client_needs"],
});

export function DebugState() {
  const lipData = useDrawerStore((state) => state.lipData);

  return (
    <Card style={divStyle}>
      <CardHeader>Debug stato lip</CardHeader>
      <CardBody>
        <Debug>{lipData}</Debug>
      </CardBody>
    </Card>
  );
}
