import {isSubmitErrors} from "@/ui/form/helpers";
import {type BaseSyntheticEvent} from "react";
import {Form as RBForm, type FormProps as RBFormProps} from "react-bootstrap";
import {
  DefaultValues,
  type FieldValues,
  FormProvider,
  Path,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import {WithChildren} from "../types";

interface BaseFormProps<TFieldValues extends FieldValues>
  extends WithChildren,
    Omit<RBFormProps, "onSubmit"> {
  onSubmit: (
    values: TFieldValues,
    event?: BaseSyntheticEvent,
  ) => void | Promise<void>;
}

type FormProps<TFieldValues extends FieldValues> =
  | (BaseFormProps<TFieldValues> & {
      defaultValues: DefaultValues<TFieldValues>;
      formMethods?: never;
    })
  | (BaseFormProps<TFieldValues> & {
      defaultValues?: never;
      formMethods: UseFormReturn<TFieldValues>;
    });

export function Form<TFieldValues extends FieldValues>({
  children,
  defaultValues,
  formMethods: propFormMethods,
  onSubmit,
  ...rbFormProps
}: FormProps<TFieldValues>) {
  const hookFormMethods = useForm<TFieldValues>({
    mode: "onChange",
    defaultValues,
  });
  const formMethods = propFormMethods || hookFormMethods;

  return (
    <RBForm
      onSubmit={formMethods.handleSubmit(async (data, event) => {
        try {
          await onSubmit?.(data, event);
        } catch (e) {
          if (isSubmitErrors(data)(e)) {
            Object.entries(e).forEach(([key, value]) => {
              formMethods.setError(key as "root" | Path<TFieldValues>, value, {
                shouldFocus: true,
              });
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
