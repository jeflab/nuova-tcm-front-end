import invariant from "tiny-invariant";

export type Option = {label: string; value: string};

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
  invariant(firstValue, "Options should have at least one value");
  return [firstValue, ...otherValues];
}
