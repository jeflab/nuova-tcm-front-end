"use client";

import {drawers} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {ButtonLink} from "@/ui/ButtonLink";
import {Debug} from "@/ui/Debug";
import React, {useEffect} from "react";
import {ButtonGroup, Card, CardBody, CardHeader} from "react-bootstrap";

const divStyle = {} as const;

const mockLipData = (step?: string) => {
  if (step === "fatca") {
    return;
  }
  useDrawerStore.getState().updateFatca(false);
  if (step === "contractorFiscalCode") {
    return;
  }
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
  if (step === "contractorPersonalAreaActivation") {
    return;
  }
  useDrawerStore.getState().updateLipData({agentId: 2});
  useDrawerStore.getState().updateContractorPersonalAreaActivation(true);
  if (step === "contractorData") {
    return;
  }
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
  if (step === "identification") {
    return;
  }
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
  if (step === "den") {
    return;
  }
  useDrawerStore.getState().updateDenData({
    education: "degree",
    job: "self_employed_or_freelancer",
    family: "1",
    dependentFamilyMembers: "0",
    otherInsuranceProducts: "yes",
    needsIntendToMeet: ["investment", "personal_insurance_protection"],
    savings: "1000",
    income: "30000",
    economicCondition: "stationary",
    expectations: [
      "home_protection",
      "capital_and_personal_protection",
      "investment",
    ],
    // expectations: ["home_protection"], // Expected block
    duration: "long_term",
    // duration: "1_year", // Expected block
  });
  if (step === "quote") {
    return;
  }
  useDrawerStore.getState().updateQuoteData({
    birthDate: "1984-06-24",
    smoker: "no",
    death: "50000",
    accidentalDeath: true,
    trafficAccidentalDeath: false,
    exemptionFromPaying: true,
    tpi: {
      enabled: false,
      coverage: "0",
    },
    cancer: {
      enabled: true,
      coverage: "35000",
    },
    tpd: {
      enabled: true,
      coverage: "35000",
    },
    premium: 624.4350796807557,
  });
  if (step === "healthQuestionnaire") {
    return;
  }
  useDrawerStore.getState().updateHealthQuestionnaireData({
    weight: "80",
    height: "180",
    hospitalization: "yes",
    diseases: "no",
    drugTherapy: "no",
    symptomatology: "no",
    professionalRisk: "yes",
    sportRisk: "no",
    cancer: "no",
    nervousSystemDiseases: "no",
    invalidityPension: "no",
    physicalImpairment: "no",
  });
  // useDrawerStore.getState().updateBeneficiariesData({
  //   nomination: "heirs",
  //   thirdParty: true,
  //   thirdPartyContactPerson: {
  //     name: "Mangiavini",
  //     surname: "Andrea",
  //     birthDate: "1983-09-08",
  //     birthPlace: {
  //       city: "Brescia",
  //       province: "BS",
  //     },
  //     fiscalCode: "MNGNDR83P08B157U",
  //     place: {
  //       city: "Torbole Casaglia",
  //       province: "BS",
  //     },
  //     streetName: "Via San Filastrio",
  //     streetNumber: "122",
  //     zipCode: "25030",
  //     phone: "3282883728",
  //     email: "mangiavini.andrea@gmail.com",
  //   },
  // });
  if (step === "beneficiaries") {
    return;
  }
  useDrawerStore.getState().updateBeneficiariesData({
    nomination: "beneficiaries",
    thirdParty: true,
    beneficiaries: [
      {
        surname: "Lazzaroni",
        name: "Fabio",
        birthDate: "1984-06-24",
        birthPlace: {
          city: "Lovere",
          province: "BG",
        },
        fiscalCode: "LZZFBA84H24E704I",
        streetName: "Via Tito Speri",
        streetNumber: "10",
        place: {
          city: "Castelcovati",
          province: "BS",
        },
        zipCode: "25030",
        phone: "393206441946",
        email: "fabio.lazza@tiscali.it",
        share: "51",
      },
      {
        surname: "Mangiavini",
        name: "Andrea",
        birthDate: "1983-09-08",
        birthPlace: {
          city: "Brescia",
          province: "BS",
        },
        fiscalCode: "MNGNDR83P08B157U",
        streetName: "Via San Filastrio",
        streetNumber: "122",
        place: {
          city: "Torbole Casaglia",
          province: "BS",
        },
        zipCode: "25030",
        phone: "3282883728",
        email: "mangiavini.andrea@gmail.com",
        share: "49",
      },
    ],
    thirdPartyContactPerson: {
      surname: "Poli",
      name: "Marco",
      birthDate: "1980-03-21",
      birthPlace: {
        city: "Brescia",
        province: "BS",
      },
      fiscalCode: "PLIMRC80C21B157U",
      place: {
        city: "Offlaga",
        province: "BS",
      },
      streetName: "Via Roma",
      streetNumber: "1",
      zipCode: "25030",
      phone: "3201234567",
      email: "poli@example.com",
    },
  });
  if (step === "documentation") {
    return;
  }
  useDrawerStore.getState().updateDocumentationData({
    totalEsigns: 2,
    files: [
      {
        fileName: "altro_file_altra_firma.pdf",
        requiredFile: true,
        esigns: [
          {
            whoEsign: "contractor",
            required: true,
            description:
              "<p>Con la presente firma verranno accettati i contenuti dei seguenti capitoli:</p><ul><li>PG 4/13 - PREMIO UNICO LORDO</li><li>PG 4/13 - CARATTERISTICHE DEL INVESTIMENTO</li><li>PG 4/13 - DICHIARAZIONI</li><li>PG 5/13 - DICHIARAZIONI</li><li>PG 5/13 - COPERTURA COMPLEMENTARE FACOLTATIVA PER IL CASO MORTE</li><li>PG 6/13 - CONSENSO PER DATI PERSONALI  - COMUNICAZIONE ELETTRONICA</li><li>PG 6/13 - DICHIARAZIONE DI RESIDENZA AI FINI FISCALI</li><li>PG 7/13 - ATTESTAZIONE DI CONSEGNA</li><li>PG 8/13 - INFORMAZIONI SULLA OPERAZIONE</li></ul>",
            page: "14",
            leftX: "30",
            leftY: "110",
            rightX: "450",
            rightY: "40",
            esignId: 1,
            esignDate: new Date("2024-03-04T22:20:57.761Z"),
            esignUser: {
              cell: "0123456789",
              email: "mario@example.com",
              fiscalCode: "MRSRSS84H24E704I",
              name: "Mario",
              surname: "Rossi",
            },
          },
          {
            whoEsign: "advisor",
            required: true,
            description:
              "<p>Con la presente firma verranno accettati i contenuti dei seguenti capitoli:</p><ul><li>PG 6/13 - SPAZIO RISERVATO AL SOGGETTO INCARICATO DELL ADEGUATA VERIFICA</li></ul>",
            page: "14",
            leftX: "320",
            leftY: "110",
            rightX: "740",
            rightY: "40",
            esignId: 1,
            esignDate: new Date("2024-03-04T22:20:45.066Z"),
            esignUser: {
              cell: "0123456789",
              email: "mario@example.com",
              fiscalCode: "MRSRSS84H24E704I",
              name: "Mario",
              surname: "Rossi",
            },
          },
          {
            whoEsign: "contractor",
            required: true,
            description:
              "<p>seconda firma per il contractor:</p><ul><li>PG 4/13 - PREMIO UNICO LORDO</li><li>PG 4/13 - CARATTERISTICHE DEL INVESTIMENTO</li><li>PG 4/13 - DICHIARAZIONI</li><li>PG 5/13 - DICHIARAZIONI</li><li>PG 5/13 - COPERTURA COMPLEMENTARE FACOLTATIVA PER IL CASO MORTE</li><li>PG 6/13 - CONSENSO PER DATI PERSONALI  - COMUNICAZIONE ELETTRONICA</li><li>PG 6/13 - DICHIARAZIONE DI RESIDENZA AI FINI FISCALI</li><li>PG 7/13 - ATTESTAZIONE DI CONSEGNA</li><li>PG 8/13 - INFORMAZIONI SULLA OPERAZIONE</li></ul>",
            page: "14",
            leftX: "30",
            leftY: "110",
            rightX: "450",
            rightY: "40",
            esignId: 1,
            esignDate: new Date("2024-03-04T22:20:56.144Z"),
            esignUser: {
              cell: "0123456789",
              email: "mario@example.com",
              fiscalCode: "MRSRSS84H24E704I",
              name: "Mario",
              surname: "Rossi",
            },
          },
        ],
      },
      {
        fileName: "allianz_darta_saving_periodical_solution.pdf",
        requiredFile: true,
        esigns: [
          {
            whoEsign: "advisor",
            required: true,
            description:
              "<p>Con la presente firma verranno accettati i contenuti dei seguenti capitoli:</p><ul><li>PG 6/13 - SPAZIO RISERVATO AL SOGGETTO INCARICATO DELL ADEGUATA VERIFICA</li></ul>",
            page: "14",
            leftX: "320",
            leftY: "110",
            rightX: "740",
            rightY: "40",
            esignId: 1,
            esignDate: new Date("2024-03-04T22:20:50.843Z"),
            esignUser: {
              cell: "0123456789",
              email: "mario@example.com",
              fiscalCode: "MRSRSS84H24E704I",
              name: "Mario",
              surname: "Rossi",
            },
          },
        ],
      },
    ],
    allFilesUploaded: true,
    allRequiredFilesUploaded: true,
  });
  if (step === "payment") {
    return;
  }
  useDrawerStore.getState().updatePaymentData({
    bank: "BANCA POPOLARE DI BERGAMO",
    iban: "IT09V0300203280163398573817",
    paymentMethod: "5yearsAdvance",
  });
};

interface DebugStateProps {
  step?: string;
}

export function DebugState({step}: DebugStateProps) {
  const lipData = useDrawerStore((state) => state.lipData);
  const resetLipData = useDrawerStore((state) => state.resetLipData);

  useEffect(() => {
    mockLipData(step);

    return () => {
      resetLipData();
    };
  }, [resetLipData, step]);

  return (
    <Card style={divStyle}>
      <CardHeader>Debug stato lip</CardHeader>
      <CardBody>
        <ButtonGroup className="d-flex flex-wrap gap-2">
          {drawers.map((drawer) => (
            <ButtonLink
              key={drawer.name}
              href={`debug?step=${drawer.name}`}
              variant="primary"
              className="d-flex align-items-center btn-sm"
            >
              {drawer.shortTitle ?? drawer.title}
            </ButtonLink>
          ))}
          <ButtonLink
            href="debug?step=all"
            variant="primary"
            className="d-flex align-items-center btn-sm"
          >
            Tutti
          </ButtonLink>
        </ButtonGroup>
        <Debug className="mt-3">{lipData}</Debug>
      </CardBody>
    </Card>
  );
}
