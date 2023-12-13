import {useContext} from "react";
import Feedback from "react-bootstrap/esm/Feedback";
import FormContext from "react-bootstrap/FormContext";
import {get, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";

interface FieldErrorProps {
  name?: string;
}

const DEFAULT_MESSAGES = {
  required: "è obbligatorio",
  pattern: "non è nel formato corretto",
  minLength: "è troppo corto",
  maxLength: "è troppo lungo",
  min: "è troppo basso",
  max: "è troppo alto",
  validate: "non è valido",
};

export function FieldError({name}: FieldErrorProps) {
  const {
    formState: {errors},
  } = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const validationError = get(errors, controlName);
  const errorMessage =
    validationError &&
    (validationError.message ||
      `${controlName} ${
        DEFAULT_MESSAGES[validationError.type as keyof typeof DEFAULT_MESSAGES]
      }`);

  return validationError ? (
    <Feedback type="invalid">{errorMessage}</Feedback>
  ) : null;
}
