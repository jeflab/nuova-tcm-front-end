import {InputHTMLAttributes, useContext} from "react";
import {FormControl} from "react-bootstrap";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions, get, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import {z} from "zod";

type InputTypes = "email" | "hidden" | "password" | "text";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  type: InputTypes;
  validation?: RegisterOptions;
}

export function InputField({name, type, validation}: InputFieldProps) {
  const {
    register,
    formState: {errors},
  } = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const validationError = get(errors, controlName);

  return (
    <FormControl
      type={type}
      {...register(name || controlId, validation)}
      isInvalid={!!validationError}
    />
  );
}
