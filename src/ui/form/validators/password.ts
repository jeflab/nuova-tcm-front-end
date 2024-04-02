const REGEX_PASSWORD =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]).{12,}$/;

export function password(value: string) {
  console.log("password", value, REGEX_PASSWORD.test(value));
  return REGEX_PASSWORD.test(value);
}
