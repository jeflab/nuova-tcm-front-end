import {checkAuth, getAccount} from "@/app/(no-menu)/(auth)/actions";
import {normalizeError} from "@/helpers/errors";
import {ReactNode} from "react";
import {SyncAccountToStore} from "./SyncAccountToStore";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({children}: AuthLayoutProps) {
  await checkAuth();
  const account = await getAccount();

  if (account?.status !== "success") {
    throw normalizeError(account);
  }

  return (
    <>
      <SyncAccountToStore account={account} />
      {children}
    </>
  );
}
