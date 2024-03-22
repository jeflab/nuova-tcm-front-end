import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {PreliminaryData} from "@/app/(menu)/(authenticated)/lips/models";
import {Lip} from "@/entities/lip";
import {DrawerState, presetButtons} from "@/ui/drawer/types";
import {produce} from "immer";
import {create} from "zustand";
import {TempLipData} from "../models";

interface State {
  preliminaryData: PreliminaryData;
  lip?: Lip;
  lipData: TempLipData;
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
  updateDocumentationData: (data: TempLipData["documentation"]) => void;
  resetLipData: () => void;
}

const updateLipData = (state: State, data: Partial<TempLipData>) => {
  const newState = state;
  newState.lipData = {...newState.lipData, ...data};

  return newState;
};

function createDrawerState(state: State & Actions) {
  // Dati preliminari
  const isPreliminary = !state.lip;
  state.drawerStates = {fatca: {variant: "active", ...presetButtons.compile}};

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
      if (
        !state.lip?.contractor.identitydocument ||
        state.lip.contractor.identitydocument.length === 0
      ) {
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
      if (state.lip?.quotation === null) {
        state.drawerStates.quote = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (state.lip?.quotation?.premium) {
        state.drawerStates.quote = {variant: "success"};
      } else {
        state.drawerStates.quote = {variant: "danger"};
      }
    } else {
      state.drawerStates.quote = undefined;
    }

    // Questionario sanitario / non sanitario
    if (state.drawerStates.quote?.variant === "success") {
      if (!state.lip?.healthcareQuestionnaire) {
        state.drawerStates.healthQuestionnaire = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        state.drawerStates.healthQuestionnaire = {variant: "success"};
      }
    }

    // Beneficiari
    if (state.drawerStates.healthQuestionnaire?.variant === "success") {
      if (!state.lip?.beneficiaries) {
        state.drawerStates.beneficiaries = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        state.drawerStates.beneficiaries = {variant: "success"};
      }
    }

    // Pagamento
    if (state.drawerStates.beneficiaries?.variant === "success") {
      if (state.lip?.payment === null) {
        state.drawerStates.payment = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        state.drawerStates.payment = {variant: "success"};
      }
    }

    // Documentazione
    if (state.drawerStates.payment?.variant === "success") {
      if (
        state.lip?.eSigns?.polizza &&
        Object.keys(state.lip?.eSigns?.polizza).length === 3 &&
        state.lip.eSigns.identificazione
      ) {
        state.drawerStates.documentation = {variant: "success"};
      } else {
        state.drawerStates.documentation = {
          variant: "active",
          ...presetButtons.documentEsign,
        };
      }
    }
  }
}

export const useDrawerStore = create<State & Actions>()((set) => ({
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
        state.lip = lip ? {...lip} : undefined;
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
  updateDocumentationData: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {documentation: data});
      }),
    ),
  resetLipData: () =>
    set(() => ({
      lipData: {},
      modalOpen: null,
      drawerStates: {fatca: {variant: "active", ...presetButtons.compile}},
    })),
}));
