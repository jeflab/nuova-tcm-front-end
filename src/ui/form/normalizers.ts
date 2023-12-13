export const upperCaseNormalizer = (text: string) =>
  text.toUpperCase().replace(/\s/g, "");

export const upperCaseWordsNormalizer = (text: string) =>
  text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });

export const upperCaseFirstNormalizer = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
