"use client";
import {WithChildren} from "@/ui/types";
import {ThemeProvider} from "next-themes";

export function Providers({children}: WithChildren) {
  return (
    <ThemeProvider
      storageKey="tcm-theme"
      enableColorScheme={false}
      attribute="data-bs-theme"
    >
      {children}
    </ThemeProvider>
  );
}
