import {cns} from "@/helpers/cns";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {ReactNode, useContext} from "react";
import FormContext from "react-bootstrap/FormContext";
import {
  type FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import invariant from "tiny-invariant";

type GroupTypes = "checkbox" | "radio" | "switch";

interface SingleValue<TValue> {
  type: "radio" | "radio-switch";
  defaultValue?: TValue;
  onChange?: (value: TValue) => void;
}
interface MultipleValues<TValue> {
  type: "checkbox" | "switch";
  defaultValue?: TValue[];
  onChange?: (value: TValue[]) => void;
}

type CheckGroupProps<TFieldValues extends FieldValues, TValue> = (
  | SingleValue<TValue>
  | MultipleValues<TValue>
) & {
  disabled?: boolean;
  inline?: boolean;
  name?: string;
  options: readonly {label: ReactNode; value: TValue}[];
  readOnly?: boolean;
  validation?: RegisterOptions<TFieldValues>;
};

export function CheckGroup<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
>({
  defaultValue,
  disabled,
  inline,
  name,
  onChange,
  options,
  readOnly,
  type,
  validation,
}: CheckGroupProps<TFieldValues, TValue>) {
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {getValues} = useFormContext();

  return (
    <div>
      {options.map(({label, value}) => {
        const readOnlyDisabled = readOnly && defaultValue !== value;
        return (
          <CheckboxField
            key={`${controlName}-${value}`}
            onChange={() => {
              onChange?.(getValues(controlName));
            }}
            defaultChecked={defaultValue === value}
            disabled={disabled || readOnlyDisabled}
            id={`${controlName}-${value}`}
            inline={inline}
            label={label}
            readOnly={readOnly}
            type={type === "radio-switch" ? "radio" : type}
            validation={validation as any}
            value={value}
            className={cns(type === "radio-switch" && "form-switch")}
          />
        );
      })}
    </div>
  );
}
