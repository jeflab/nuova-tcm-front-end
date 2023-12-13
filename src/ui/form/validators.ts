const lastCharFiscalCode = (fc: string): boolean => {
  if (fc.length !== 16) {
    return false;
  }

  const map = [
    1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4,
    18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23,
  ];

  let s = 0;
  for (let i = 0; i < 15; i++) {
    let c = fc.charCodeAt(i);
    if (c < 65) {
      c = c - 48;
    } else {
      c = c - 55;
    }
    if (i % 2 === 0) {
      s += map[c];
    } else {
      s += c < 10 ? c : c - 10;
    }
  }
  const expected = String.fromCharCode(65 + (s % 26));
  return expected === fc.charAt(15);
};

const REGEX_FISCAL_CODE =
  /^[A-Z]{6}[A-Z0-9]{2}[ABCDEHLMPRST][A-Z0-9]{2}[A-Z][A-Z0-9]{3}[A-Z]$/;

export const fiscalCodeValidator = (value: string) => {
  return REGEX_FISCAL_CODE.test(value) && lastCharFiscalCode(value);
};
