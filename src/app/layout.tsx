import {Providers} from "@/ui/Providers";
import {getTheme} from "@/ui/Theme/actions";
import {config} from "@fortawesome/fontawesome-svg-core";
import type {Metadata} from "next";
import {ReactNode} from "react";
import "./globals.scss";

// Fix icone giganti: non importiamo qui ma importiamo manualmente i css in globals.scss
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Piattaforma TCM",
  description: "Web app per la gestione delle polizze TCM",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
  const theme = getTheme();

  return (
    <html lang="it" data-bs-theme={theme}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
