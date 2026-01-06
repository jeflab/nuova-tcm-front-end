import {getAccountQuery} from "@/app/(menu)/(authenticated)/queries";
import {checkAuth, getAccount} from "@/app/(no-menu)/(auth)/actions";
import {normalizeError} from "@/helpers/errors";
import {getQueryClient} from "@/ui/getQueryClient";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ReactNode} from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({children}: AuthLayoutProps) {
  await checkAuth();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(getAccountQuery());

  const account = await getAccount();

  if (account?.status !== "success") {
    throw normalizeError(account);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
