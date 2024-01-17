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
}

const updateLipData = (state: State, data: TempLipData) => {
  const newState = state;
  newState.lipData = data;

  // fatca
  if (newState.lipData.fatca === undefined) {
    newState.drawerStates.fatca = "active";
  } else if (!newState.lipData.fatca) {
    newState.drawerStates.fatca = "success";
  } else {
    newState.drawerStates.fatca = "danger";
  }

  // contractor
  if (newState.drawerStates.fatca === "success") {
    if (newState.lipData.contractor === undefined) {
      newState.drawerStates.contractor = "active";
    } else if (!newState.lipData.contractor) {
      newState.drawerStates.contractor = "success";
    } else {
      newState.drawerStates.contractor = "danger";
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
}));
