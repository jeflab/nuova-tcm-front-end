"use client";

import {fakeActivateContractorPersonalArea} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import useInterval from "beautiful-react-hooks/useInterval";
import {useState} from "react";

export function ContractorPersonalAreaActivationSummary() {
  const [countdown, setCountdown] = useState(10);
  const drawerState = useDrawerStore(
    (state) => state.drawerStates["contractorPersonalAreaActivation"],
  );
  const updateContractorPersonalAreaActivation = useDrawerStore(
    (state) => state.updateContractorPersonalAreaActivation,
  );
  const contractorPersonalAreaActivation = useDrawerStore(
    (state) => state.lipData.contractorPersonalAreaActivation,
  );

  const [, clearInterval] = useInterval(async () => {
    if (drawerState === "waiting") {
      if (countdown <= 0) {
        clearInterval();
        const isActive = await fakeActivateContractorPersonalArea();
        if (isActive) {
          updateContractorPersonalAreaActivation(true);
        }
      }
      setCountdown(countdown - 1);
    }
  }, 1000);

  if (
    contractorPersonalAreaActivation === undefined &&
    drawerState !== "waiting"
  ) {
    return null;
  }

  if (drawerState === "waiting") {
    return (
      <p className="mb-0">
        In attesa dell'attivazione area cliente {countdown}
      </p>
    );
  }

  if (!contractorPersonalAreaActivation) {
    return (
      <p className="mb-0">Non è stato possibile attivare l'area cliente</p>
    );
  }

  return <p className="mb-0">Area cliente attivata</p>;
}
