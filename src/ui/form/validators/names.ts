const REGEX_ARUBA_NAMES = /^[(?U)\p{L}\s,.'\-]+$/u;

export function arubaNames(value: string) {
  return REGEX_ARUBA_NAMES.test(value);
}
