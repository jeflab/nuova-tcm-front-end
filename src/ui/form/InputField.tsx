import {useValidationState} from "@/ui/form/hooks";
import {
  ChangeEvent,
  ComponentProps,
  KeyboardEventHandler,
  useContext,
} from "react";
import {FormControl} from "react-bootstrap";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";

type InputTypes =
  | "email"
  | "hidden"
  | "password"
  | "text"
  | "date"
  | "number"
  | "tel";

interface InputFieldProps extends ComponentProps<typeof FormControl> {
  name?: string;
  type: InputTypes;
  validation?: RegisterOptions;
  normalize?: (value: string) => string;
  validationStyle?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({
  name,
  normalize,
  onChange,
  type,
  validation,
  validationStyle = true,
  ...inputProps
}: InputFieldProps) {
  const {setValue, register} = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {isInvalid, isValid} = useValidationState(controlName);
  const normalization = normalize && {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValue(controlName, normalize(e.target.value), {
        shouldValidate: true,
      });
    },
  };
  const preventNotNumber = type === "number" && {
    onKeyDown: ((e) => {
      if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
        e.preventDefault();
      }
    }) as KeyboardEventHandler<HTMLInputElement>,
  };

  return (
    <FormControl
      type={type}
      {...register(controlName, {
        onChange,
        ...validation,
        ...normalization,
      })}
      isInvalid={validationStyle && isInvalid}
      isValid={validationStyle && isValid}
      aria-invalid={isInvalid}
      aria-errormessage={isInvalid ? `${controlName}-error` : undefined}
      aria-describedby={`${controlName}-help`}
      {...preventNotNumber}
      {...inputProps}
    />
  );
}
