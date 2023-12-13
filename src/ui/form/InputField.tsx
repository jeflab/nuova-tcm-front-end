import {ChangeEvent, useContext} from "react";
import {FormControl, FormControlProps} from "react-bootstrap";
import FormContext from "react-bootstrap/FormContext";
import {get, RegisterOptions, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";

type InputTypes = "email" | "hidden" | "password" | "text";

interface InputFieldProps extends FormControlProps {
  name?: string;
  type: InputTypes;
  validation?: RegisterOptions;
  normalize?: (value: string) => string;
}

export function InputField({
  name,
  type,
  validation,
  normalize,
  onChange,
  ...inputProps
}: InputFieldProps) {
  const {
    setValue,
    register,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const validationError = get(errors, controlName);
  const dirty = get(dirtyFields, controlName);
  const normalization = normalize && {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValue(controlName, normalize(e.target.value), {
        shouldValidate: true,
      });
    },
  };

  return (
    <FormControl
      type={type}
      {...register(name || controlId, {
        ...validation,
        ...normalization,
      })}
      isInvalid={!!validationError}
      isValid={dirty && !validationError}
      {...inputProps}
    />
  );
}
