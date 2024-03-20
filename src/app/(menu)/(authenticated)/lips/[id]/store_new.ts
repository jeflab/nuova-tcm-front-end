import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {PreliminaryData} from "@/app/(menu)/(authenticated)/lips/models";
import {Lip} from "@/entities/lip";
import {DrawerState, presetButtons} from "@/ui/drawer/types";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

interface State {
  preliminaryData: PreliminaryData;
  lip: Lip | null;
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
}
interface Actions {
  updatePreliminaryData: (data: Partial<PreliminaryData>) => void;
  updateLip: (lip: Lip) => void;
  resetState: () => void;
}

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
  }
}

const initialState = {
  lip: null,
  preliminaryData: {},
  drawerStates: {fatca: {variant: "active", ...presetButtons.compile}} as const,
};

// const useLipStore = create<State & Actions>()(
export const useDrawerStore = create<State & Actions>()(
  immer((set) => ({
    ...initialState,
    updatePreliminaryData: (preliminaryData) =>
      set((state) => {
        state.preliminaryData = {...state.preliminaryData, ...preliminaryData};
        createDrawerState(state);
      }),
    updateLip: (lip) =>
      set((state) => {
        state.lip = lip;
        createDrawerState(state);
      }),
    resetState: () => {
      set(initialState);
    },
  })),
);
