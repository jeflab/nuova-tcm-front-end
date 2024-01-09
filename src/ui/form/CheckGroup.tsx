import {CheckboxField} from "@/ui/form/CheckboxField";
import {useContext} from "react";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions} from "react-hook-form";
import invariant from "tiny-invariant";

type GroupTypes = "checkbox" | "radio" | "switch";

interface CheckGroupProps<TValue> {
  inline?: boolean;
  name?: string;
  options: {label: string; value: TValue}[];
  type: GroupTypes;
  validation?: RegisterOptions;
}

export function CheckGroup<TValue extends string | number>({
  inline,
  name,
  options,
  type,
  validation,
}: CheckGroupProps<TValue>) {
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  return (
    <div>
      {options.map(({label, value}) => (
        <CheckboxField
          key={`${controlName}-${value}`}
          id={`${controlName}-${value}`}
          inline={inline}
          label={label}
          type={type}
          validation={validation}
          value={value}
        />
      ))}
    </div>
  );
}
