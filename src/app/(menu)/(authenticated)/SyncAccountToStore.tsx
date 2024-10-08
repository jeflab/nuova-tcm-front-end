"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Account} from "@/models/account";

interface SyncAccountToStoreProps {
  account: Account;
}

export function SyncAccountToStore({account}: SyncAccountToStoreProps) {
  useStore((state) => state.updateAccount)(account);
  return null;
}
