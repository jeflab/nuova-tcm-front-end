import {useValidationState} from "@/ui/form/hooks";
import {ComponentProps, useContext} from "react";
import {FormSelect} from "react-bootstrap";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";

interface SelectFieldProps<
  TValue extends string | number,
> extends ComponentProps<typeof FormSelect> {
  name?: string;
  options: readonly {label: string; value: TValue}[];
  placeholder?: string;
  validation?: RegisterOptions;
  validationStyle?: boolean;
}

export function SelectField<TValue extends string | number>({
  name,
  options,
  placeholder,
  validation,
  validationStyle = true,
  onChange,
  ...inputProps
}: SelectFieldProps<TValue>) {
  const {register} = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {isInvalid, isValid} = useValidationState(controlName);

  return (
    <FormSelect
      {...register(controlName, {
        onChange,
        ...validation,
      })}
      isInvalid={validationStyle && !inputProps.disabled && isInvalid}
      isValid={validationStyle && !inputProps.disabled && isValid}
      aria-invalid={isInvalid}
      aria-errormessage={isInvalid ? `${controlName}-error` : undefined}
      aria-describedby={`${controlName}-help`}
      {...inputProps}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(({label, value}) => {
        return (
          <option key={`${controlName}-${value}`} value={value}>
            {label}
          </option>
        );
      })}
    </FormSelect>
  );
}
