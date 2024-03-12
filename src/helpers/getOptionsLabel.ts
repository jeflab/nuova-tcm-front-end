export type Option = {label: string; value: string};

export const yesNoOptions = [
  {value: "yes", label: "Si"},
  {value: "no", label: "No"},
] as const;
export type YesNoAnswer = (typeof yesNoOptions)[number]["value"];

export function getOptionsLabel<TValue extends string>(
  inputOptions: readonly {value: TValue; label: string}[],
  selected: TValue,
) {
  const selectedOption = inputOptions.find(
    (option) => option.value === selected,
  );
  return selectedOption?.label;
}

export function getOptionsValues<TValue extends string>(
  inputOptions: readonly {value: TValue; label: string}[],
): [TValue, ...TValue[]] {
  const [firstValue, ...otherValues] = Array.from(inputOptions).map(
    (option) => option.value,
  );
  return [firstValue, ...otherValues];
}
