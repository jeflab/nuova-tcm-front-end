import {isSubmitErrors} from "@/ui/form/helpers";
import {type BaseSyntheticEvent} from "react";
import {Form as RBForm, type FormProps as RBFormProps} from "react-bootstrap";
import {type FieldValues, FormProvider, Path, useForm} from "react-hook-form";
import {WithChildren} from "../types";

interface FormProps<TFieldValues extends FieldValues>
  extends WithChildren,
    Omit<RBFormProps, "onSubmit"> {
  onSubmit: (
    values: TFieldValues,
    event?: BaseSyntheticEvent,
  ) => void | Promise<void>;
}
export default function Form<TFieldValues extends FieldValues>({
  children,
  onSubmit,
  ...rbFormProps
}: FormProps<TFieldValues>) {
  const formMethods = useForm<TFieldValues>({mode: "onChange"});

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
      {...rbFormProps}
    >
      <FormProvider {...formMethods}>{children}</FormProvider>
    </RBForm>
  );
}
