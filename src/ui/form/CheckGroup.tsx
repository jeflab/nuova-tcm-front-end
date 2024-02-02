import {CheckboxField} from "@/ui/form/CheckboxField";
import {useContext} from "react";
import FormContext from "react-bootstrap/FormContext";
import {
  type FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import invariant from "tiny-invariant";

type GroupTypes = "checkbox" | "radio" | "switch";

interface SingleValue<TValue> {
  type: "radio";
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
  options: readonly {label: string; value: TValue}[];
  readOnly?: boolean;
  type: GroupTypes;
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
            type={type}
            validation={validation as any}
            value={value}
          />
        );
      })}
    </div>
  );
}
