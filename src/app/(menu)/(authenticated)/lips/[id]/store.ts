import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/page";
import {create} from "zustand";
import {TempLipData} from "../model";
import {produce} from "immer";

interface State {
  lipData: TempLipData;
  modalOpen: DrawerName | null;
  drawerStates: Partial<Record<DrawerName, "success" | "danger" | "active">>;
}

interface Actions {
  openModal: (id: DrawerName) => void;
  closeModal: () => void;
  updateFatca: (data: TempLipData["fatca"]) => void;
  updateContractorFiscalCode: (
    data: TempLipData["contractorFiscalCode"],
  ) => void;
}

const updateLipData = (state: State, data: TempLipData) => {
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
    } else if (!!newState.lipData.contractorFiscalCode) {
      newState.drawerStates.contractorFiscalCode = "success";
    } else {
      newState.drawerStates.contractorFiscalCode = "danger";
    }
  }

  // Attesa creazione aria cliente
  if (newState.drawerStates.contractorFiscalCode === "success") {
    if (newState.lipData.contractorPersonalAreaActivation === undefined) {
      newState.drawerStates.contractorPersonalAreaActivation = "active";
    } else if (!newState.lipData.contractorPersonalAreaActivation) {
      newState.drawerStates.contractorPersonalAreaActivation = "success";
    } else {
      newState.drawerStates.contractorPersonalAreaActivation = "danger";
    }
  }

  return newState;
};

export const useDrawerStore = create<State & Actions>((set) => ({
  lipData: {},
  modalOpen: null,
  drawerStates: {fatca: "active"},
  openModal: (id) => set(() => ({modalOpen: id})),
  closeModal: () => set(() => ({modalOpen: null})),
  updateFatca: (data: TempLipData["fatca"]) =>
    set(
      produce((state) => {
        updateLipData(state, {fatca: data});
      }),
    ),
  updateContractorFiscalCode: (data: TempLipData["contractorFiscalCode"]) =>
    set(
      produce((state) => {
        updateLipData(state, {contractorFiscalCode: data});
      }),
    ),
}));

useDrawerStore.getState().updateFatca(false);
