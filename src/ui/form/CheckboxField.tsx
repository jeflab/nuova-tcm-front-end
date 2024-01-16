import {cns} from "@/helpers/cns";
import {useValidationState} from "@/ui/form/hooks";
import {ChangeEvent, ComponentPropsWithoutRef, useContext} from "react";
import {FormCheck} from "react-bootstrap";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import styles from "./CheckboxField.module.scss";

type InputTypes = "checkbox" | "radio" | "switch";

interface CheckboxFieldProps
  extends Omit<
    ComponentPropsWithoutRef<typeof FormCheck>,
    "onChange" | "Input" | "Label"
  > {
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type: InputTypes;
  validation?: RegisterOptions;
  validationStyle?: boolean;
  stretchedLabel?: boolean;
}

export function CheckboxField({
  name,
  onChange,
  type,
  validation,
  validationStyle = true,
  className,
  stretchedLabel,
  disabled,
  ...checkboxProps
}: CheckboxFieldProps) {
  const {
    register,
    formState: {isSubmitting},
  } = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {isInvalid, isValid} = useValidationState(controlName);

  return (
    <FormCheck
      type={type}
      {...register(name || controlId, {
        ...validation,
        onChange,
      })}
      isInvalid={validationStyle && isInvalid}
      isValid={validationStyle && isValid}
      aria-invalid={isInvalid}
      className={cns([className, stretchedLabel && styles.stretchedLabel])}
      disabled={disabled || isSubmitting}
      {...checkboxProps}
    />
  );
}
