"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {DrawerName} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";

interface ModalContextValue {
  modalOpen: DrawerName | null;
  openModal: (id: DrawerName) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({children}: {children: ReactNode}) {
  const [modalOpen, setModalOpen] = useState<DrawerName | null>(null);

  const value = useMemo(
    () => ({
      modalOpen,
      openModal: (id: DrawerName) => setModalOpen(id),
      closeModal: () => setModalOpen(null),
    }),
    [modalOpen],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useDrawerModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(
      "useDrawerModal deve essere usato all'interno di ModalProvider",
    );
  }
  return ctx;
}
