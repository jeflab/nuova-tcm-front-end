"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Lip} from "@/entities/lip";
import {useEffect} from "react";

interface InitStoreWithServerDataProps {
  lip: Lip | undefined;
}

export function InitStoreWithServerData({lip}: InitStoreWithServerDataProps) {
  const updateLip = useDrawerStore((state) => state.updateLip);

  useEffect(() => {
    updateLip(lip);

    return () => {
      updateLip(undefined);
    };
  }, [lip, updateLip]);

  return null;
}
