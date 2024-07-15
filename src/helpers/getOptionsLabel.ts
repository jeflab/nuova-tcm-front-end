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

export function extractValuesByKey<TObject, TKey extends keyof TObject>(
  objects: readonly TObject[],
  key: TKey,
): [TObject[TKey], ...TObject[TKey][]] {
  const values = objects.map((object) => object[key]);
  if (values.length === 0) {
    throw new Error("Array must not be empty");
  }
  return [values[0], ...values.slice(1)] as [TObject[TKey], ...TObject[TKey][]];
}
