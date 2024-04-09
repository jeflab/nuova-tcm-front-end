const REGEX_PASSWORD =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]).{12,}$/;

export function password(value: string) {
  return REGEX_PASSWORD.test(value);
}
