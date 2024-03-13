import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {PreliminaryData} from "@/app/(menu)/(authenticated)/lips/models";
import {Documents, DocumentsSchema} from "@/entities/document";
import {Lip} from "@/entities/lip";
import {DrawerState, presetButtons} from "@/ui/drawer/types";
import {produce} from "immer";
import {create} from "zustand";
import {TempLipData} from "../models";

interface State {
  preliminaryData: PreliminaryData;
  lip?: Lip;
  lipData: TempLipData;
  defaultDocuments: Documents;
  modalOpen: DrawerName | null;
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
}

interface Actions {
  openModal: (id: DrawerName) => void;
  closeModal: () => void;
  updatePreliminaryData: (data: Partial<PreliminaryData>) => void;
  updateLip: (lip?: Partial<Lip>) => void;
  updateLipData: (data: Partial<TempLipData>) => void;
  updateContractorPersonalAreaActivation: (
    data: TempLipData["contractorPersonalAreaActivation"],
  ) => void;
  updateContractorData: (data: TempLipData["contractorData"]) => void;
  updateIdentificationData: (data: TempLipData["identification"]) => void;
  setPicture: (key: string, picture: string) => void;
  updateQuoteData: (data: TempLipData["quote"]) => void;
  updateHealthQuestionnaireData: (
    data: TempLipData["healthQuestionnaire"],
  ) => void;
  updateBeneficiariesData: (data: TempLipData["beneficiaries"]) => void;
  updateDocumentationData: (data: TempLipData["documentation"]) => void;
  esignDocument: (fileName: string, esignIndex: number) => void;
  updatePaymentData: (data: TempLipData["payment"]) => void;
  resetLipData: () => void;
}

const updateLipData = (state: State, data: Partial<TempLipData>) => {
  const newState = state;
  newState.lipData = {...newState.lipData, ...data};

  //
  // // Questionario sanitario / non sanitario
  // if (newState.drawerStates.quote === "success") {
  //   if (newState.lipData.healthQuestionnaire === undefined) {
  //     newState.drawerStates.healthQuestionnaire = "active";
  //   } else if (
  //     calculateImc(
  //       parseInt(newState.lipData.healthQuestionnaire.weight, 10),
  //       parseInt(newState.lipData.healthQuestionnaire.height, 10),
  //     ) < RANGE.max &&
  //     calculateImc(
  //       parseInt(newState.lipData.healthQuestionnaire.weight, 10),
  //       parseInt(newState.lipData.healthQuestionnaire.height, 10),
  //     ) > RANGE.min
  //   ) {
  //     newState.drawerStates.healthQuestionnaire = "success";
  //   } else {
  //     newState.drawerStates.healthQuestionnaire = "danger";
  //   }
  // }
  //
  // // Beneficiari
  // if (newState.drawerStates.healthQuestionnaire === "success") {
  //   if (newState.lipData.beneficiaries === undefined) {
  //     newState.drawerStates.beneficiaries = "active";
  //   } else if (newState.lipData.beneficiaries) {
  //     newState.drawerStates.beneficiaries = "success";
  //   } else {
  //     newState.drawerStates.beneficiaries = "danger";
  //   }
  // }

  // // Documentazione
  // if (newState.drawerStates.beneficiaries === "success") {
  //   if (newState.lipData.documentation === undefined) {
  //     newState.drawerStates.documentation = "active";
  //   } else if (newState.lipData.documentation) {
  //     newState.drawerStates.documentation = "success";
  //   } else {
  //     newState.drawerStates.documentation = "danger";
  //   }
  // }

  return newState;
};

function createDrawerState(state: State & Actions) {
  // Dati preliminari
  const isPreliminary = !state.lip;

  if (isPreliminary) {
    // fatca
    if (state.preliminaryData.fatca === undefined) {
      state.drawerStates.fatca = {variant: "active", ...presetButtons.compile};
    } else if (state.preliminaryData.fatca === "no") {
      state.drawerStates.fatca = {variant: "success"};
    } else {
      state.drawerStates.fatca = {variant: "danger"};
    }

    // contractor fiscal code
    if (state.drawerStates.fatca?.variant === "success") {
      if (state.preliminaryData.contractorPersonalData === undefined) {
        state.drawerStates.contractorFiscalCode = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (!state.preliminaryData.contractorAlreadyRegistered) {
        state.drawerStates.contractorFiscalCode = {variant: "success"};
      } else {
        state.drawerStates.contractorFiscalCode = {variant: "danger"};
      }
    } else {
      state.drawerStates.contractorFiscalCode = undefined;
    }

    // Attesa creazione aria cliente
    if (state.drawerStates.contractorFiscalCode?.variant === "success") {
      if (state.lip?.contractor === undefined) {
        state.drawerStates.contractorPersonalAreaActivation = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (state.lip.contractor.lastPrivacyEsignId === null) {
        state.drawerStates.contractorPersonalAreaActivation = {
          variant: "waiting",
          ...presetButtons.privacyEsign,
        };
      } else {
        state.drawerStates.contractorPersonalAreaActivation = {
          variant: "success",
        };
      }
    } else {
      state.drawerStates.contractorPersonalAreaActivation = undefined;
    }
  } else {
    // Dati da server
    // fatca
    if (state.lip?.contractor?.fatca.fatcaCheck.response === undefined) {
      state.drawerStates.fatca = {variant: "active", ...presetButtons.compile};
    } else if (state.lip?.contractor.fatca.fatcaCheck.response === "no") {
      state.drawerStates.fatca = {variant: "success"};
    } else {
      state.drawerStates.fatca = {variant: "danger"};
    }

    // contractor fiscal code
    if (state.drawerStates.fatca?.variant === "success") {
      if (state.lip?.contractor === undefined) {
        state.drawerStates.contractorFiscalCode = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        state.drawerStates.contractorFiscalCode = {variant: "success"};
      }
    } else {
      state.drawerStates.contractorFiscalCode = undefined;
    }

    // Attesa creazione aria cliente
    if (state.drawerStates.contractorFiscalCode?.variant === "success") {
      if (state.lip?.contractor === undefined) {
        state.drawerStates.contractorPersonalAreaActivation = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (state.lip.contractor.lastPrivacyEsignId === null) {
        state.drawerStates.contractorPersonalAreaActivation = {
          variant: "waiting",
          ...presetButtons.privacyEsign,
        };
      } else {
        state.drawerStates.contractorPersonalAreaActivation = {
          variant: "success",
        };
      }
    } else {
      state.drawerStates.contractorPersonalAreaActivation = undefined;
    }

    // Censimento cliente
    if (
      state.drawerStates.contractorPersonalAreaActivation?.variant === "success"
    ) {
      if (state.lip?.contractor.city === null) {
        state.drawerStates.contractorData = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        state.drawerStates.contractorData = {variant: "success"};
      }
    } else {
      state.drawerStates.contractorData = undefined;
    }

    // Identificazione cliente
    if (state.drawerStates.contractorData?.variant === "success") {
      if (!state.lip || state.lip.contractor.identitydocument.length === 0) {
        state.drawerStates.identification = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (state.lip.contractor.identitydocument.length > 0) {
        state.drawerStates.identification = {variant: "success"};
      } else {
        state.drawerStates.identification = {variant: "danger"};
      }
    } else {
      state.drawerStates.identification = undefined;
    }

    // Demand and needs
    if (state.drawerStates.identification?.variant === "success") {
      if (state.lip?.den === null) {
        state.drawerStates.den = {variant: "active", ...presetButtons.compile};
      } else if (
        state.lip?.den &&
        state.lip.den.duration.response === "long_term" &&
        (["capital_and_personal_protection"] as const).some((value) =>
          state.lip?.den?.expectations.response.includes(value),
        )
      ) {
        state.drawerStates.den = {variant: "success"};
      } else {
        state.drawerStates.den = {variant: "danger"};
      }
    } else {
      state.drawerStates.den = undefined;
    }

    // Preventivo
    if (state.drawerStates.den?.variant === "success") {
      if (state.lip?.json_quotation === null) {
        state.drawerStates.quote = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (state.lipData.quote) {
        state.drawerStates.quote = {variant: "success"};
      } else {
        state.drawerStates.quote = {variant: "danger"};
      }
    }
  }
}

const defaultDocuments = DocumentsSchema.parse({
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
        },
      ],
      uploaded: true,
      uploadedFileName:
        "allianz_darta_saving_periodical_solution_0703260006.pdf",
      uploadDate: "2022-03-08 15:46:16",
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
        },
      ],
      uploaded: true,
      uploadedFileName:
        "allianz_darta_saving_periodical_solution_0703260006.pdf",
      uploadDate: "2022-03-08 15:46:16",
    },
  ],
  allFilesUploaded: true,
  allRequiredFilesUploaded: true,
});

export const useDrawerStore = create<State & Actions>()((set) => ({
  defaultDocuments,
  lipData: {},
  preliminaryData: {},
  modalOpen: null,
  drawerStates: {fatca: {variant: "active", ...presetButtons.compile}},
  openModal: (id) => set(() => ({modalOpen: id})),
  closeModal: () => set(() => ({modalOpen: null})),
  updatePreliminaryData: (data: Partial<PreliminaryData>) =>
    set(
      produce((state: State & Actions) => {
        state.preliminaryData = {...state.preliminaryData, ...data};
        createDrawerState(state);
      }),
    ),
  updateLip: (lip) =>
    set(
      produce((state) => {
        state.lip = {...lip};
        createDrawerState(state);
      }),
    ),
  updateLipData: (data: Partial<TempLipData>) =>
    set(produce((state) => updateLipData(state, data))),
  updateContractorPersonalAreaActivation: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {contractorPersonalAreaActivation: data});
        state.lipData.contractorFiscalCode.phone = "1234567890";
        state.lipData.contractorFiscalCode.email = "email@example.com";
      }),
    ),
  updateContractorData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {contractorData: data});
      }),
    ),
  updateIdentificationData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {identification: data});
      }),
    ),
  setPicture: (key, picture) =>
    set(
      produce((state) => {
        if (!state.lipData.idPictures) {
          state.lipData.idPictures = {};
        }
        state.lipData.idPictures[key] = picture;
      }),
    ),
  updateQuoteData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {quote: data});
      }),
    ),
  updateHealthQuestionnaireData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {healthQuestionnaire: data});
      }),
    ),
  updateBeneficiariesData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {beneficiaries: data});
      }),
    ),
  updateDocumentationData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {documentation: data});
      }),
    ),
  esignDocument: (fileName, esignIndex) =>
    set(
      produce((state: State) => {
        state.lipData.documentation ??= state.defaultDocuments;
        const file = state.lipData.documentation.files.find(
          (file) => file.fileName === fileName,
        );
        if (!file) {
          return;
        }

        file.esigns[esignIndex].esignId = 1;
        file.esigns[esignIndex].esignDate = new Date();
        file.esigns[esignIndex].esignUser = {
          cell: "0123456789",
          email: "mario@example.com",
          fiscalCode: "MRSRSS84H24E704I",
          name: "Mario",
          surname: "Rossi",
        };
      }),
    ),
  updatePaymentData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {payment: data});
      }),
    ),
  resetLipData: () =>
    set(() => ({
      lipData: {},
      modalOpen: null,
      drawerStates: {fatca: {variant: "active", ...presetButtons.compile}},
    })),
}));
