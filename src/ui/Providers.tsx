import {ModalProvider} from "@/ui/ModalContext";
import {ThemeProvider} from "@/ui/Theme/ThemeProvider";
import {WithChildren} from "@/ui/types";
import {QueryProvider} from "./QueryProvider";

export function Providers({children}: WithChildren) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ModalProvider>{children}</ModalProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
