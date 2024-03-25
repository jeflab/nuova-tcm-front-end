"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Lip} from "@/models/entities/lip";
import {useEffect} from "react";

interface InitStoreWithServerDataProps {
  lip: Lip | null;
}

export function InitStoreWithServerData({lip}: InitStoreWithServerDataProps) {
  const updateLip = useDrawerStore((state) => state.updateLip);
  const updatePreliminaryData = useDrawerStore(
    (state) => state.updatePreliminaryData,
  );

  useEffect(() => {
    updateLip(lip);
    if (!lip) {
      updatePreliminaryData(null);
    }

    return () => {
      updateLip(null);
    };
  }, [lip, updateLip]);

  return null;
}
