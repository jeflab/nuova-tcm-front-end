import {toDecimal} from "@/helpers/numbers";

export const naturalNormalizer = (value: string) => {
  return numberNormalizer(value, {decimal: false, negative: false});
};

export const integerNormalizer = (value: string) => {
  return numberNormalizer(value, {decimal: false, negative: true});
};

export const floatNormalizer = (value: string) => {
  return numberNormalizer(value, {decimal: true, negative: true});
};

export const positiveFloatNormalizer = (value: string) => {
  return numberNormalizer(value, {decimal: true, negative: false});
};

export const decimalNormalizer = (value: string) => {
  const float = parseFloat(floatNormalizer(value));
  return toDecimal(float);
};

export const numberNormalizer = (
  value: string,
  {decimal = true, negative = true},
) => {
  if (!value) {
    return "";
  }

  // eslint-disable-next-line no-useless-escape
  value = value.replace(/[^\d.,-]/g, ""); // Rimuove tutti i caratteri strani
  if (negative) {
    value = value.replace(/(?!^)-/g, ""); // Rimuove tutti i "-" che non sono all'inizio
  } else {
    value = value.replace(/-/g, ""); // Rimuove tutti i "-"
  }
  value = value.replace(/,/g, "."); // Sostituisce tutti i punti con delle virgole
  if (decimal) {
    value = value.replace(".", "%FD%"); // Mette un placeholder al posto del primo punto
  }
  value = value
    .replace(/\./g, "") // Rimuove tutte le virgole
    .replace("%FD%", "."); // Rimette il punto al posto del placeholder

  return value;
};

export const onlyNumbersNormalizer = (value: string) =>
  value.replaceAll(/\D/g, "");

export const upperCaseNormalizer = (text: string) => {
  if (!text) {
    return "";
  }

  return text.toUpperCase().replace(/\s/g, "");
};

export const lowercaseCaseNormalizer = (text: string) => {
  if (!text) {
    return "";
  }

  return text.toLowerCase().replace(/\s/g, "");
};

export const emailNormalizer = (code: string) =>
  code.toLowerCase().replace(/\s/g, "");

export const upperCaseWordsNormalizer = (text: string) => {
  if (!text) {
    return "";
  }

  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const upperCaseFirstNormalizer = (text: string) => {
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
};
