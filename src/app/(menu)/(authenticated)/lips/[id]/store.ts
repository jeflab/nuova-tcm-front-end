import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {DrawerState} from "@/ui/drawer/const";
import {create} from "zustand";
import {TempLipData} from "../model";
import {produce} from "immer";

interface State {
  lipData: TempLipData;
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
  updateHealthQuestionnaire: (data: TempLipData["healthQuestionnaire"]) => void;
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
      newState.lipData.den.duration === "multi_year" &&
      (
        [
          "capital_for_heirs",
          "protection_against_death_accident_and_illness",
        ] as const
      ).some((value) => newState.lipData.den?.expectations.includes(value))
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
    } else if (newState.lipData.healthQuestionnaire.feelingGood) {
      newState.drawerStates.healthQuestionnaire = "success";
    } else {
      newState.drawerStates.healthQuestionnaire = "danger";
    }
  }

  // Beneficiari

  return newState;
};

export const useDrawerStore = create<State & Actions>()((set) => ({
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
  updateHealthQuestionnaire: (data) =>
    set(
      produce((state) => {
        updateLipData(state, {healthQuestionnaire: data});
      }),
    ),
}));
