export function getOptionsLabel<TValue extends string>(
  inputOptions: readonly {value: TValue; label: string}[],
  selected: TValue,
) {
  const selectedOption = inputOptions.find(
    (option) => option.value === selected,
  );
  return selectedOption?.label;
}
