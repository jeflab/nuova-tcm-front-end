import {Form as RBForm, type FormProps as RBFormProps} from "react-bootstrap";
import {
  type FieldValues,
  useForm,
  type UseFormProps,
  FormProvider,
} from "react-hook-form";
import {WithChildren} from "../types";
import {type BaseSyntheticEvent} from "react";

interface FormProps<TFieldValues extends FieldValues>
  extends WithChildren,
    Omit<RBFormProps, "onSubmit"> {
  onSubmit: (values: TFieldValues, event?: BaseSyntheticEvent) => void;
}
export default function Form<TFieldValues extends FieldValues>({
  children,
  onSubmit,
  ...rbFormProps
}: FormProps<TFieldValues>) {
  const formMethods = useForm<TFieldValues>({mode: "onChange"});
  return (
    <RBForm
      onSubmit={formMethods.handleSubmit(
        (data, event) => onSubmit?.(data, event),
      )}
      {...rbFormProps}
    >
      <FormProvider {...formMethods}>{children}</FormProvider>
    </RBForm>
  );
}
