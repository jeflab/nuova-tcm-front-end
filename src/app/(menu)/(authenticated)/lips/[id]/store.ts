import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {PreliminaryData} from "@/app/(menu)/(authenticated)/lips/models";
import {Documents, DocumentsSchema} from "@/entities/document";
import {Lip} from "@/entities/lip";
import {PersonalData} from "@/entities/personalData";
import {DrawerState, presetButtons} from "@/ui/drawer/types";
import {produce} from "immer";
import {create} from "zustand";
import {TempLipData} from "../models";

interface State {
  preliminaryData: PreliminaryData;
  lip?: Lip;
  contractor?: PersonalData;
  lipData: TempLipData;
  defaultDocuments: Documents;
  modalOpen: DrawerName | null;
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
}

interface Actions {
  openModal: (id: DrawerName) => void;
  closeModal: () => void;
  updatePreliminaryData: (data: Partial<PreliminaryData>) => void;
  updateLip: (data: {
    lip?: Partial<Lip>;
    contractor?: Partial<PersonalData>;
  }) => void;
  updateLipData: (data: Partial<TempLipData>) => void;
  updateContractorPersonalAreaActivation: (
    data: TempLipData["contractorPersonalAreaActivation"],
  ) => void;
  updateContractorData: (data: TempLipData["contractorData"]) => void;
  updateIdentificationData: (data: TempLipData["identification"]) => void;
  setPicture: (key: string, picture: string) => void;
  updateDenData: (data: TempLipData["den"]) => void;
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
  // // Identificazione cliente
  // if (newState.drawerStates.contractorData === "success") {
  //   if (newState.lipData.identification === undefined) {
  //     newState.drawerStates.identification = "active";
  //   } else if (newState.lipData.identification) {
  //     newState.drawerStates.identification = "success";
  //   } else {
  //     newState.drawerStates.identification = "danger";
  //   }
  // } else {
  //   newState.drawerStates.identification = undefined;
  // }
  //
  // // Demand and needs
  // if (newState.drawerStates.identification === "success") {
  //   if (newState.lipData.den === undefined) {
  //     newState.drawerStates.den = "active";
  //   } else if (
  //     newState.lipData.den &&
  //     newState.lipData.den.duration === "multi_year" &&
  //     (
  //       [
  //         "capital_for_heirs",
  //         "protection_against_death_accident_and_illness",
  //       ] as const
  //     ).some((value) => newState.lipData.den?.expectations.includes(value))
  //   ) {
  //     newState.drawerStates.den = "success";
  //   } else {
  //     newState.drawerStates.den = "danger";
  //   }
  // } else {
  //   newState.drawerStates.den = undefined;
  // }
  //
  // // Preventivo
  // if (newState.drawerStates.den === "success") {
  //   if (newState.lipData.quote === undefined) {
  //     newState.drawerStates.quote = "active";
  //   } else if (newState.lipData.quote) {
  //     newState.drawerStates.quote = "success";
  //   } else {
  //     newState.drawerStates.quote = "danger";
  //   }
  // }
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
    if (state.contractor === undefined) {
      state.drawerStates.contractorPersonalAreaActivation = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else if (state.contractor.lastPrivacyEsignId === null) {
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
    if (state.lipData.contractorData === undefined) {
      state.drawerStates.contractorData = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else if (state.lipData.contractorData) {
      state.drawerStates.contractorData = {variant: "success"};
    } else {
      state.drawerStates.contractorData = {variant: "danger"};
    }
  } else {
    state.drawerStates.contractorData = undefined;
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
  updateLip: (data) =>
    set(
      produce((state) => {
        state.lip = {...state.lip, ...data.lip};
        state.contractor = {...state.contractor, ...data.contractor};
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
  updateDenData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {den: data});
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
