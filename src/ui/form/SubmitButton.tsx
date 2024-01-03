import {ReactNode, useEffect} from "react";
import {Button} from "react-bootstrap";
import {ButtonProps} from "react-bootstrap/Button";
import {useFormContext} from "react-hook-form";

interface SubmitButtonProps extends Omit<ButtonProps, "children" | "type"> {
  children: ReactNode | ((isSubmitting: boolean) => ReactNode);
}

export function SubmitButton({children, ...props}: SubmitButtonProps) {
  const {
    formState: {isSubmitting, errors},
  } = useFormContext();

  const realChildren =
    typeof children === "function" ? children(isSubmitting) : children;

  return (
    <Button type="submit" {...props} disabled={isSubmitting || props.disabled}>
      {realChildren}
    </Button>
  );
}
