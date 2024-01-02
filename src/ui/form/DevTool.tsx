import {useFormContext} from "react-hook-form";
import {DevTool as HookFormDevTool} from "@hookform/devtools";

export function DevTool() {
  const {control} = useFormContext();

  return <HookFormDevTool control={control} />;
}
