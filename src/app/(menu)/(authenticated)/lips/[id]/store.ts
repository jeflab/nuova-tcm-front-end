import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {RANGE, calculateImc} from "@/app/(menu)/(authenticated)/lips/[id]/imc";
import {Document, Documents, DocumentsSchema} from "@/entities/document";
import {DrawerState} from "@/ui/drawer/const";
import {create} from "zustand";
import {TempLipData} from "../model";
import {produce} from "immer";

interface State {
  lipData: TempLipData;
  defaultDocuments: Documents;
  modalOpen: DrawerName | null;
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
}

interface Actions {
  openModal: (id: DrawerName) => void;
  closeModal: () => void;
  updateLipData: (data: Partial<TempLipData>) => void;
  updateFatca: (data: TempLipData["fatca"]) => void;
  updateContractorFiscalCode: (
    data: Omit<
      NonNullable<TempLipData["contractorFiscalCode"]>,
      "phone" | "email"
    >,
  ) => void;
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

  // fatca
  if (newState.lipData.fatca === undefined) {
    newState.drawerStates.fatca = "active";
  } else if (!newState.lipData.fatca) {
    newState.drawerStates.fatca = "success";
  } else {
    newState.drawerStates.fatca = "danger";
  }

  // contractor fiscal code
  if (newState.drawerStates.fatca === "success") {
    if (newState.lipData.contractorFiscalCode === undefined) {
      newState.drawerStates.contractorFiscalCode = "active";
    } else if (
      !!newState.lipData.contractorFiscalCode &&
      (!newState.lipData.agentId || newState.lipData.agentId === 2)
    ) {
      newState.drawerStates.contractorFiscalCode = "success";
    } else {
      newState.drawerStates.contractorFiscalCode = "danger";
    }
  } else {
    newState.drawerStates.contractorFiscalCode = undefined;
  }

  // Attesa creazione aria cliente
  if (newState.drawerStates.contractorFiscalCode === "success") {
    if (newState.lipData.contractorPersonalAreaActivation === undefined) {
      newState.drawerStates.contractorPersonalAreaActivation = "waiting";
    } else if (newState.lipData.contractorPersonalAreaActivation) {
      newState.drawerStates.contractorPersonalAreaActivation = "success";
    } else {
      newState.drawerStates.contractorPersonalAreaActivation = "danger";
    }
  } else {
    newState.drawerStates.contractorPersonalAreaActivation = undefined;
  }

  // Censimento cliente
  if (newState.drawerStates.contractorPersonalAreaActivation === "success") {
    if (newState.lipData.contractorData === undefined) {
      newState.drawerStates.contractorData = "active";
    } else if (newState.lipData.contractorData) {
      newState.drawerStates.contractorData = "success";
    } else {
      newState.drawerStates.contractorData = "danger";
    }
  } else {
    newState.drawerStates.contractorData = undefined;
  }

  // Identificazione cliente
  if (newState.drawerStates.contractorData === "success") {
    if (newState.lipData.identification === undefined) {
      newState.drawerStates.identification = "active";
    } else if (newState.lipData.identification) {
      newState.drawerStates.identification = "success";
    } else {
      newState.drawerStates.identification = "danger";
    }
  } else {
    newState.drawerStates.identification = undefined;
  }

  // Demand and needs
  if (newState.drawerStates.identification === "success") {
    if (newState.lipData.den === undefined) {
      newState.drawerStates.den = "active";
    } else if (
      newState.lipData.den &&
      newState.lipData.den.duration === "long_term" &&
      (["capital_and_personal_protection"] as const).some((value) =>
        newState.lipData.den?.expectations.includes(value),
      )
    ) {
      newState.drawerStates.den = "success";
    } else {
      newState.drawerStates.den = "danger";
    }
  } else {
    newState.drawerStates.den = undefined;
  }

  // Preventivo
  if (newState.drawerStates.den === "success") {
    if (newState.lipData.quote === undefined) {
      newState.drawerStates.quote = "active";
    } else if (newState.lipData.quote) {
      newState.drawerStates.quote = "success";
    } else {
      newState.drawerStates.quote = "danger";
    }
  }

  // Questionario sanitario / non sanitario
  if (newState.drawerStates.quote === "success") {
    if (newState.lipData.healthQuestionnaire === undefined) {
      newState.drawerStates.healthQuestionnaire = "active";
    } else if (
      calculateImc(
        parseInt(newState.lipData.healthQuestionnaire.weight, 10),
        parseInt(newState.lipData.healthQuestionnaire.height, 10),
      ) < RANGE.max &&
      calculateImc(
        parseInt(newState.lipData.healthQuestionnaire.weight, 10),
        parseInt(newState.lipData.healthQuestionnaire.height, 10),
      ) > RANGE.min
    ) {
      newState.drawerStates.healthQuestionnaire = "success";
    } else {
      newState.drawerStates.healthQuestionnaire = "danger";
    }
  }

  // Beneficiari
  if (newState.drawerStates.healthQuestionnaire === "success") {
    if (newState.lipData.beneficiaries === undefined) {
      newState.drawerStates.beneficiaries = "active";
    } else if (newState.lipData.beneficiaries) {
      newState.drawerStates.beneficiaries = "success";
    } else {
      newState.drawerStates.beneficiaries = "danger";
    }
  }

  // Documentazione
  if (newState.drawerStates.beneficiaries === "success") {
    if (newState.lipData.documentation === undefined) {
      newState.drawerStates.documentation = "active";
    } else if (
      newState.lipData.documentation.files.every((file) =>
        file.esigns.every((esign) => esign.esignId),
      )
    ) {
      newState.drawerStates.documentation = "success";
    } else {
      newState.drawerStates.documentation = "danger";
    }
  }

  // Pagamento
  if (newState.drawerStates.documentation === "success") {
    if (newState.lipData.payment === undefined) {
      newState.drawerStates.payment = "active";
    } else if (newState.lipData.payment) {
      newState.drawerStates.payment = "success";
    } else {
      newState.drawerStates.payment = "danger";
    }
  } else {
    newState.drawerStates.payment = undefined;
  }

  return newState;
};

const documentsBase = DocumentsSchema.parse({
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
  defaultDocuments: documentsBase,
  lipData: {},
  modalOpen: null,
  drawerStates: {fatca: "active"},
  openModal: (id) => set(() => ({modalOpen: id})),
  closeModal: () => set(() => ({modalOpen: null})),
  updateLipData: (data: Partial<TempLipData>) =>
    set(produce((state) => updateLipData(state, data))),
  updateFatca: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {fatca: data});
      }),
    ),
  updateContractorFiscalCode: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {contractorFiscalCode: data});
      }),
    ),
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
      drawerStates: {fatca: "active"},
    })),
}));
