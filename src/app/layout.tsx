import {Providers} from "@/ui/Providers";
import {getTheme} from "@/ui/Theme/actions";
import {config as fontAwesomeConfig} from "@fortawesome/fontawesome-svg-core";
import type {Metadata} from "next";
import {ReactNode} from "react";
import "./globals.scss";

// Fix icone giganti: non importiamo qui ma importiamo manualmente i css in globals.scss
fontAwesomeConfig.autoAddCss = false;

export const metadata: Metadata = {
  title: "Smart Broker Space",
  description: "Web app per la gestione delle polizze TCM",
  other: {
    "data-git-commit": process.env.VERCEL_GIT_COMMIT_SHA ?? "development",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({children}: RootLayoutProps) {
  const theme = await getTheme();

  return (
    <html lang="it" data-bs-theme={theme}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
