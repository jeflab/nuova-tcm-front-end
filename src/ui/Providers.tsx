import {ThemeProvider} from "@/ui/Theme/ThemeProvider";
import {WithChildren} from "@/ui/types";
import {QueryProvider} from "./QueryProvider";

export function Providers({children}: WithChildren) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
