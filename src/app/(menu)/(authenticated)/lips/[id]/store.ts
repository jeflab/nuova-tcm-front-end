import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {validateDen} from "@/helpers/lip-validator";
import {Account} from "@/models/account";
import {Lip} from "@/models/entities/lip";
import {PreliminaryData} from "@/models/preliminaryData";
import {DrawerState, presetButtons} from "@/ui/drawer/types";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

interface State {
  account?: Account;
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
  updateAccount: (account: Account | undefined) => void;
}

const initialState: State = {
  drawerStates: {type: {variant: "active", ...presetButtons.compile}},
  lip: null,
  modalOpen: null,
  preliminaryData: {},
};

function createState(state: State & Actions) {
  // Dati preliminari
  const isPreliminary = !state.lip;
  state.drawerStates = {...initialState.drawerStates};

  const atLeastOneESign =
    (state.lip?.eSigns?.polizza &&
      Object.keys(state.lip?.eSigns?.polizza).length > 0) ||
    (state.lip?.eSigns?.identificazione &&
      Object.keys(state.lip?.eSigns?.identificazione).length > 0);
  const privacyESigned = !!state.lip?.contractor?.lastPrivacyESignId;

  const askForUnderwriting =
    // se le condizioni sanitarie non sono rispettate
    (state.lip?.mustAskUnderwriting ?? false) &&
    // e abbiamo i beneficiari, quindi siamo pre-pagamento
    state.lip &&
    state.lip?.beneficiaries &&
    // se lo stato è sconosciuto, o incompleto)
    (state.lip?.lipStates?.id === 0 || state.lip?.lipStates.id === 1);
  const underwritingUnderInvestigation = state.lip?.lipStates?.id === 2;
  const underwritingNotApproved = state.lip?.lipStates?.id === 15;
  const underwritingApproved = state.lip?.lipStates?.id === 14;
  const allowUpdatesBeforePayment =
    !atLeastOneESign &&
    !underwritingUnderInvestigation &&
    !underwritingNotApproved &&
    !underwritingApproved;

  const blockPayment =
    askForUnderwriting || underwritingUnderInvestigation
      ? 2
      : underwritingNotApproved
        ? 15
        : false;
  const amlBlocked = state.lip?.aml?.blocked ?? false;

  if (isPreliminary) {
    // type
    if (state.preliminaryData.type === undefined) {
      state.drawerStates.type = {variant: "active", ...presetButtons.compile};
    } else {
      state.drawerStates.type = {variant: "success"};
    }

    // fatca
    if (state.drawerStates.type?.variant === "success") {
      if (state.preliminaryData.fatca === undefined) {
        state.drawerStates.fatca = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (
        state.preliminaryData.fatca === "no" &&
        state.preliminaryData.italianResidency === "yes" &&
        (state.preliminaryData.type === "self-insured" ||
          (state.preliminaryData.insuredFatca === "no" &&
            state.preliminaryData.insuredItalianResidency === "yes"))
      ) {
        state.drawerStates.fatca = {variant: "success"};
      } else {
        state.drawerStates.fatca = {variant: "danger", ...presetButtons.update};
      }
    } else {
      state.drawerStates.fatca = undefined;
    }

    // contractor fiscal code
    if (state.drawerStates.fatca?.variant === "success") {
      if (
        !state.preliminaryData.contractorAlreadyRegistered &&
        state.preliminaryData.contractorPersonalData === undefined
      ) {
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

    // Contatti Contraente
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
    // type
    if (state.lip?.type === undefined) {
      state.drawerStates.type = {variant: "active", ...presetButtons.compile};
    } else {
      state.drawerStates.type = {variant: "success"};
    }

    // fatca
    if (state.drawerStates.type?.variant === "success") {
      if (state.lip?.contractor?.fatca.fatcaCheck.response === undefined) {
        state.drawerStates.fatca = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (
        state.lip?.contractor.fatca.fatcaCheck.response === "no" &&
        state.lip?.contractor.fatca.residencyCheck.response === "yes" &&
        (state.lip?.type === "self-insured" ||
          (state.lip?.insured?.fatca.fatcaCheck.response === "no" &&
            state.lip?.insured?.fatca.residencyCheck.response === "yes"))
      ) {
        state.drawerStates.fatca = {variant: "success"};
      } else {
        state.drawerStates.fatca = {variant: "danger"};
      }
    } else {
      state.drawerStates.fatca = undefined;
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

    // Contatti Contraente
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

    // Attesa creazione area Contraente
    if (state.drawerStates.contractorContacts?.variant === "success") {
      if (state.lip?.contractor.lastPrivacyESignId === null) {
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

    // Censimento Contraente
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
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      }
    } else {
      state.drawerStates.contractorData = undefined;
    }

    // Identificazione Contraente
    if (state.drawerStates.contractorData?.variant === "success") {
      if (
        !state.lip?.contractor.identityDocument ||
        state.lip.contractor.identityDocument.length === 0
      ) {
        state.drawerStates.identification = {
          variant: "active",
          ...presetButtons.compile,
        };
      } else if (state.lip.contractor.identityDocument.length > 0) {
        state.drawerStates.identification = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
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
      } else if (validateDen(state.lip?.den)) {
        state.drawerStates.den = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      } else {
        state.drawerStates.den = {
          variant: "danger",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
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
          ...(allowUpdatesBeforePayment && presetButtons.update),
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
        state.drawerStates.healthQuestionnaire = {
          variant: "success",
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
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
          ...(allowUpdatesBeforePayment && presetButtons.update),
        };
      }
    }

    // Pagamento
    if (state.drawerStates.beneficiaries?.variant === "success") {
      if (blockPayment) {
        state.drawerStates.payment = {
          variant: blockPayment === 2 ? "waiting" : "danger",
          isLocked: true,
        };
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
    const requiredProposalESign = state.lip?.mustAskUnderwriting ? 4 : 3;
    if (state.drawerStates.payment?.variant === "success") {
      if (amlBlocked) {
        state.drawerStates.documentation = {variant: "waiting", isLocked: true};
      } else if (
        state.lip?.eSigns?.polizza &&
        Object.keys(state.lip?.eSigns?.polizza).length ===
          requiredProposalESign &&
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

    // Certificato
    if (state.drawerStates.documentation?.variant === "success") {
      if (!state.lip?.certificate) {
        state.drawerStates.certificate = {
          variant: "waiting",
        };
      } else {
        state.drawerStates.certificate = {
          variant: "success",
        };
      }
    }

    // state.drawerStates.beneficiaries = {
    //   variant: "waiting",
    //   buttonLabel: "Debug",
    // };
  }
}

export const useStore = create<State & Actions>()(
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
        createState(state);
      }),
    updateLip: (lip) =>
      set((state) => {
        state.lip = lip;
        createState(state);
      }),
    updateAccount: (account: Account | undefined) =>
      set((state) => {
        state.account = account;
      }),
    resetState: () => {
      set(initialState);
    },
  })),
);
