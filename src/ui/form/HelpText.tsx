import {cns} from "@/helpers/cns";
import {useContext} from "react";
import {FormText, FormTextProps} from "react-bootstrap";
import FormContext from "react-bootstrap/FormContext";
import {get, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import {WithChildren} from "@/ui/types";

interface HelpTextProps extends Omit<FormTextProps, "as"> {
  hideOnError?: boolean | string | string[];
}

export function HelpText({
  children,
  hideOnError,
  className,
  ...props
}: HelpTextProps) {
  const {controlId} = useContext(FormContext);
  invariant(controlId, "name or controlId is required");
  const {
    formState: {errors},
  } = useFormContext();
  const validationError = get(errors, controlId);

  const shouldHide =
    validationError &&
    (hideOnError === true ||
      (Array.isArray(hideOnError) &&
        hideOnError.includes(validationError.type)) ||
      (typeof hideOnError === "string" &&
        hideOnError === validationError.type));

  return (
    <FormText
      {...props}
      as="div"
      id={`${controlId}-help`}
      className={cns(["w-100", shouldHide && "d-none", className])}
    >
      {children}
    </FormText>
  );
}
