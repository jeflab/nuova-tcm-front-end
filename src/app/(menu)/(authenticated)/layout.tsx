import {ReactNode} from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({children}: AuthLayoutProps) {
  return <>{children}</>;
}
