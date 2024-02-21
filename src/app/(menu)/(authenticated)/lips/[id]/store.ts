import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {PreliminaryData} from "@/app/(menu)/(authenticated)/lips/models";
import {Contractor} from "@/entities/contractor";
import {Lip} from "@/entities/lip";
import {DrawerState} from "@/ui/drawer/const";
import {produce} from "immer";
import {create} from "zustand";
import {TempLipData} from "../models";

interface State {
  preliminaryData: PreliminaryData;
  lip?: Lip;
  contractor?: Contractor;
  lipData: TempLipData;
  modalOpen: DrawerName | null;
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
}

interface Actions {
  openModal: (id: DrawerName) => void;
  closeModal: () => void;
  updatePreliminaryData: (data: Partial<PreliminaryData>) => void;
  updateLip: (data: {
    lip: Partial<Lip>;
    contractor: Partial<Contractor>;
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

  // Documentazione
  if (newState.drawerStates.beneficiaries === "success") {
    if (newState.lipData.documentation === undefined) {
      newState.drawerStates.documentation = "active";
    } else if (newState.lipData.documentation) {
      newState.drawerStates.documentation = "success";
    } else {
      newState.drawerStates.documentation = "danger";
    }
  }

  return newState;
};

function createDrawerState(state: State & Actions) {
  // fatca
  if (state.preliminaryData.fatca === undefined) {
    state.drawerStates.fatca = "active";
  } else if (state.preliminaryData.fatca === "no") {
    state.drawerStates.fatca = "success";
  } else {
    state.drawerStates.fatca = "danger";
  }

  // contractor fiscal code
  if (state.drawerStates.fatca === "success") {
    if (state.preliminaryData.contractorPersonalData === undefined) {
      state.drawerStates.contractorFiscalCode = "active";
    } else if (!state.preliminaryData.contractorAlreadyRegistered) {
      state.drawerStates.contractorFiscalCode = "success";
    } else {
      state.drawerStates.contractorFiscalCode = "danger";
    }
  } else {
    state.drawerStates.contractorFiscalCode = undefined;
  }

  // Attesa creazione aria cliente
  if (state.drawerStates.contractorFiscalCode === "success") {
    if (state.contractor === undefined) {
      state.drawerStates.contractorPersonalAreaActivation = "active";
    } else if (state.contractor.lastPrivacyEsignId === null) {
      state.drawerStates.contractorPersonalAreaActivation = "waiting";
    } else {
      state.drawerStates.contractorPersonalAreaActivation = "success";
    }
  } else {
    state.drawerStates.contractorPersonalAreaActivation = undefined;
  }

  // Censimento cliente
  if (state.drawerStates.contractorPersonalAreaActivation === "success") {
    if (state.lipData.contractorData === undefined) {
      state.drawerStates.contractorData = "active";
    } else if (state.lipData.contractorData) {
      state.drawerStates.contractorData = "success";
    } else {
      state.drawerStates.contractorData = "danger";
    }
  } else {
    state.drawerStates.contractorData = undefined;
  }
}

export const useDrawerStore = create<State & Actions>()((set) => ({
  lipData: {},
  preliminaryData: {},
  modalOpen: null,
  drawerStates: {fatca: "active"},
  openModal: (id) => set(() => ({modalOpen: id})),
  closeModal: () => set(() => ({modalOpen: null})),
  updatePreliminaryData: (data: Partial<PreliminaryData>) =>
    set(
      produce((state: State & Actions) => {
        state.preliminaryData = {...state.preliminaryData, ...data};
        createDrawerState(state);
      }),
    ),
  updateLip: (data: {lip: Partial<Lip>; contractor: Partial<Contractor>}) =>
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
  resetLipData: () =>
    set(() => ({
      lipData: {},
      modalOpen: null,
      drawerStates: {fatca: "active"},
    })),
}));
