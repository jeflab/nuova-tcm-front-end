import {useValidationState} from "@/ui/form/hooks";
import {
  ChangeEvent,
  ComponentProps,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
} from "react";
import {FormControl} from "react-bootstrap";
import FormContext from "react-bootstrap/FormContext";
import {
  FieldPath,
  FieldPathValue,
  type FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import invariant from "tiny-invariant";

type InputTypes =
  | "email"
  | "hidden"
  | "password"
  | "text"
  | "date"
  | "number"
  | "tel"
  | "textarea";

interface InputFieldProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> extends Omit<ComponentProps<typeof FormControl>, "name"> {
  name?: TFieldName;
  type: InputTypes;
  validation?: RegisterOptions<TFieldValues, TFieldName>;
  normalize?: (value: string) => FieldPathValue<TFieldValues, TFieldName>;
  validationStyle?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputField<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  normalize,
  onChange,
  type,
  validation,
  validationStyle = true,
  ...inputProps
}: InputFieldProps<TFieldValues, TFieldName>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {setValue, register} = useFormContext<TFieldValues>();
  const {controlId} = useContext<{controlId?: TFieldName}>(FormContext);
  const controlName = name ?? controlId;
  invariant(controlName, "name or controlId is required");

  useEffect(() => {
    const handleWheel = (e: Event) => {
      if (document.activeElement === inputRef.current && type === "number") {
        e.preventDefault();
      }
    };
    const currentNumberInput = inputRef.current;
    currentNumberInput?.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    return () => currentNumberInput?.removeEventListener("wheel", handleWheel);
  }, [type]);

  const {isInvalid, isValid} = useValidationState(controlName);
  const normalization = normalize && {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValue(controlName, normalize(e.target.value), {
        shouldValidate: true,
      });
    },
  };
  const preventNotNumber = type === "number" && {
    onKeyDown: ((e) => {
      if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
        e.preventDefault();
      }
    }) as KeyboardEventHandler<HTMLInputElement>,
  };

  const {ref, ...reactHookFormProps} = register(controlName, {
    onChange,
    ...validation,
    ...normalization,
  });

  return (
    <FormControl
      type={type}
      as={type === "textarea" ? "textarea" : undefined}
      {...reactHookFormProps}
      ref={(instance: HTMLTextAreaElement) => {
        ref(instance);
        // @ts-expect-error-next-line
        // noinspection JSConstantReassignment
        inputRef.current = instance;
      }}
      isInvalid={validationStyle && isInvalid}
      isValid={validationStyle && isValid}
      aria-invalid={isInvalid}
      aria-errormessage={isInvalid ? `${controlName}-error` : undefined}
      aria-describedby={`${controlName}-help`}
      {...preventNotNumber}
      {...inputProps}
    />
  );
}
