import {Form as RBForm} from "react-bootstrap";
import {
  type FieldValues,
  useForm,
  type UseFormProps,
  FormProvider,
} from "react-hook-form";
import {WithChildren} from "../types";
import {type BaseSyntheticEvent} from "react";

interface FormProps<TFieldValues extends FieldValues> extends WithChildren {
  config?: UseFormProps<TFieldValues>;
  onSubmit: (value: TFieldValues, event?: BaseSyntheticEvent) => void;
  className?: string;
}
export default function Form<TFieldValues extends FieldValues>({
  children,
  className,
  onSubmit,
}: FormProps<TFieldValues>) {
  const formMethods = useForm<TFieldValues>();
  return (
    <RBForm
      onSubmit={formMethods.handleSubmit(
        (data, event) => onSubmit?.(data, event),
      )}
      className={className}
    >
      <FormProvider {...formMethods}>{children}</FormProvider>
    </RBForm>
  );
}
