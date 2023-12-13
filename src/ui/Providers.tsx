import {ThemeProvider} from "@/ui/Theme/ThemeProvider";
import {WithChildren} from "@/ui/types";

export function Providers({children}: WithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
