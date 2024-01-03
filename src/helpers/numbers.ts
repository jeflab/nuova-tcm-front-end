export const toCurrency = (value: number) => {
  return new Intl.NumberFormat("it-It", {
    style: "currency",
    currency: "EUR",
  })
    .format(value)
    .replaceAll(".", " ");
};

export const toDecimal = (value: number) => {
  return new Intl.NumberFormat("it-It", {
    style: "decimal",
  })
    .format(value)
    .replaceAll(".", " ");
};
