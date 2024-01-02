import {cns} from "@/helpers/cns";
import {ComponentPropsWithRef, ElementType, useContext} from "react";
import Feedback from "react-bootstrap/esm/Feedback";
import FormContext from "react-bootstrap/FormContext";
import {get, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";

interface FieldErrorProps<T extends ElementType> {
  name?: string;
  as?: T;
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

export function FieldError<T extends ElementType = typeof Feedback>({
  as: Component = Feedback,
  className,
  name,
  ...props
}: FieldErrorProps<T> & ComponentPropsWithRef<T>) {
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
    <Component
      type="invalid"
      id={`${controlName}-error`}
      {...props}
      className={cns(["d-block", className])}
    >
      {errorMessage}
    </Component>
  ) : null;
}
