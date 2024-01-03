import {isSubmitErrors} from "@/ui/form/helpers";
import {type BaseSyntheticEvent} from "react";
import {Form as RBForm, type FormProps as RBFormProps} from "react-bootstrap";
import {
  DefaultValues,
  type FieldValues,
  FormProvider,
  Path,
  useForm,
} from "react-hook-form";
import {WithChildren} from "../types";

interface FormProps<TFieldValues extends FieldValues>
  extends WithChildren,
    Omit<RBFormProps, "onSubmit"> {
  defaultValues?: DefaultValues<TFieldValues>;
  onSubmit: (
    values: TFieldValues,
    event?: BaseSyntheticEvent,
  ) => void | Promise<void>;
}
export function Form<TFieldValues extends FieldValues>({
  children,
  defaultValues,
  onSubmit,
  ...rbFormProps
}: FormProps<TFieldValues>) {
  const formMethods = useForm<TFieldValues>({mode: "onChange", defaultValues});

  return (
    <RBForm
      onSubmit={formMethods.handleSubmit(async (data, event) => {
        try {
          await onSubmit?.(data, event);
        } catch (e) {
          if (isSubmitErrors(data)(e)) {
            Object.entries(e).forEach(([key, value]) => {
              formMethods.setError(key as "root" | Path<TFieldValues>, value);
            });
          } else {
            throw e;
          }
        }
      })}
      noValidate
      {...rbFormProps}
    >
      <FormProvider {...formMethods}>{children}</FormProvider>
    </RBForm>
  );
}
