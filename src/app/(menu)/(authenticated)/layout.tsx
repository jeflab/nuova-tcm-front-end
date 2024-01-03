import {checkAuth} from "@/app/(no-menu)/(auth)/actions";
import {ReactNode} from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({children}: AuthLayoutProps) {
  await checkAuth();

  return <>{children}</>;
}
