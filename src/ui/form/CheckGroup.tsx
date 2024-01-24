import {CheckboxField} from "@/ui/form/CheckboxField";
import {useContext} from "react";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions} from "react-hook-form";
import invariant from "tiny-invariant";

type GroupTypes = "checkbox" | "radio" | "switch";

interface CheckGroupProps<TValue> {
  defaultValue?: TValue;
  disabled?: boolean;
  inline?: boolean;
  name?: string;
  options: readonly {label: string; value: TValue}[];
  plaintext?: boolean;
  readOnly?: boolean;
  type: GroupTypes;
  validation?: RegisterOptions;
}

export function CheckGroup<TValue extends string | number>({
  defaultValue,
  disabled,
  inline,
  name,
  options,
  plaintext,
  readOnly,
  type,
  validation,
}: CheckGroupProps<TValue>) {
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  return (
    <div>
      {options.map(({label, value}) => {
        const readOnlyDisabled = readOnly && defaultValue !== value;
        return (
          <CheckboxField
            key={`${controlName}-${value}`}
            defaultChecked={defaultValue === value}
            disabled={disabled || readOnlyDisabled}
            id={`${controlName}-${value}`}
            inline={inline}
            label={label}
            plaintext={plaintext}
            readOnly={readOnly}
            type={type}
            validation={validation}
            value={value}
          />
        );
      })}
    </div>
  );
}
