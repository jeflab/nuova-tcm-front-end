import {useMemo} from "react";
import {get, useFormContext} from "react-hook-form";

export const useValidationState = (name: string) => {
  const {
    getValues,
    formState: {defaultValues, errors, dirtyFields},
  } = useFormContext();

  const validationError = get(errors, name);
  const dirty = get(dirtyFields, name);
  const filedValue = getValues(name);

  return useMemo(
    () => ({
      isInvalid: !!validationError,
      isValid:
        !!dirty && !validationError && filedValue !== defaultValues?.[name],
    }),
    [validationError, dirty, filedValue, defaultValues, name],
  );
};
