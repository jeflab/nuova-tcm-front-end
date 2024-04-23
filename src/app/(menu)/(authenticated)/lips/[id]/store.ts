import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {imcInRange} from "@/app/(menu)/(authenticated)/lipsDrawers/imc";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {DrawerState, presetButtons} from "@/ui/drawer/types";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

interface State {
  drawerStates: Partial<Record<DrawerName, DrawerState>>;
  lip: Lip | null;
  modalOpen: DrawerName | null;
  preliminaryData: PreliminaryData;
}
interface Actions {
  closeModal: () => void;
  openModal: (id: DrawerName) => void;
  resetState: () => void;
  updateLip: (lip: Lip | null) => void;
  updatePreliminaryData: (data: Partial<PreliminaryData> | null) => void;
}

const initialState: State = {
  drawerStates: {fatca: {variant: "active", ...presetButtons.compile}},
  lip: null,
  modalOpen: null,
  preliminaryData: {},
};

function createDrawerState(state: State & Actions) {
  // Dati preliminari
  const isPreliminary = !state.lip;
  state.drawerStates = {...initialState.drawerStates};

  const atLeastOneESign =
    (state.lip?.eSigns?.polizza &&
      Object.keys(state.lip?.eSigns?.polizza).length > 0) ||
    (state.lip?.eSigns?.identificazione &&
      Object.keys(state.lip?.eSigns?.identificazione).length > 0);
  const healthQuestionnaireCompiled = !!state.lip?.healthcareQuestionnaire;
  const privacyESigned = !!state.lip?.contractor?.lastPrivacyEsignId;
  const oneYesInHealthcareQuestionnaire = Object.values(
    state.lip?.healthcareQuestionnaire ?? {},
  ).some(
    (question) => typeof question === "object" && question.check === "yes",
  );
  const isImcInRange =
    state.lip?.healthcareQuestionnaire &&
    imcInRange(
      parseInt(state.lip.healthcareQuestionnaire.weight, 10),
      parseInt(state.lip.healthcareQuestionnaire.height, 10),
    );
  const amlBlocked = state.lip?.aml?.blocked ?? false;

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

    // Contatti contraente
    if (state.drawerStates.contractorFiscalCode?.variant === "success") {
      state.drawerStates.contractorContacts = {
        variant: "active",
        ...presetButtons.compile,
      };
    } else {
      state.drawerStates.contractorContacts = undefined;
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

    // Contatti contraente
    if (state.drawerStates.contractorFiscalCode?.variant === "success") {
      if (
        state.lip?.contractor.phone === null ||
        state.lip?.contractor.email === null
      ) {
        state.drawerStates.contractorContacts = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        state.drawerStates.contractorContacts = {
          variant: "success",
          ...(!privacyESigned && presetButtons.update),
        };
      }
    } else {
      state.drawerStates.contractorContacts = undefined;
    }

    // Attesa creazione aria cliente
    if (state.drawerStates.contractorContacts?.variant === "success") {
      if (state.lip?.contractor.lastPrivacyEsignId === null) {
        state.drawerStates.contractorPersonalAreaActivation = {
          variant: "active",
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
        state.drawerStates.contractorData = {
          variant: "success",
          ...(!atLeastOneESign && presetButtons.update),
        };
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
        state.drawerStates.identification = {
          variant: "success",
          ...(!atLeastOneESign && presetButtons.update),
        };
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
        state.drawerStates.den = {
          variant: "success",
        };
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
        state.drawerStates.quote = {
          variant: "success",
          ...(!healthQuestionnaireCompiled && presetButtons.update),
        };
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
        state.drawerStates.beneficiaries = {
          variant: "success",
          ...(!atLeastOneESign && presetButtons.update),
        };
      }
    }

    // Pagamento
    if (state.drawerStates.beneficiaries?.variant === "success") {
      if (oneYesInHealthcareQuestionnaire || !isImcInRange) {
        state.drawerStates.payment = {variant: "waiting", isLocked: true};
      } else if (state.lip?.payment === null) {
        state.drawerStates.payment = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else {
        state.drawerStates.payment = {
          variant: "success",
          ...(!atLeastOneESign && presetButtons.update),
        };
      }
    }

    // Documentazione
    if (state.drawerStates.payment?.variant === "success") {
      if (amlBlocked) {
        state.drawerStates.documentation = {variant: "waiting", isLocked: true};
      } else if (
        state.lip?.eSigns?.polizza &&
        Object.keys(state.lip?.eSigns?.polizza).length === 3 &&
        state.lip.eSigns.identificazione
      ) {
        state.drawerStates.documentation = {variant: "success"};
      } else if (
        !state.lip?.privacyCompany ||
        state.lip.privacyCompany.length === 0
      ) {
        state.drawerStates.documentation = {
          variant: "active",
          ...presetButtons.checkConsent,
        };
      } else {
        state.drawerStates.documentation = {
          variant: "active",
          ...presetButtons.documentEsign,
        };
      }
    }

    // state.drawerStates.beneficiaries = {
    //   variant: "success",
    //   buttonLabel: "Test",
    // };
  }
}

export const useDrawerStore = create<State & Actions>()(
  immer((set) => ({
    ...initialState,
    openModal: (id) =>
      set((state) => {
        state.modalOpen = id;
      }),
    closeModal: () =>
      set((state) => {
        state.modalOpen = null;
      }),
    updatePreliminaryData: (preliminaryData) =>
      set((state) => {
        if (preliminaryData) {
          state.preliminaryData = {
            ...state.preliminaryData,
            ...preliminaryData,
          };
        } else {
          state.preliminaryData = initialState.preliminaryData;
        }
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
