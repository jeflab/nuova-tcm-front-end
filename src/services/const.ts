export const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
export const backendUrl = process.env.NEXT_PUBLIC_BE_URL as string;

export const contentJsonHeader = {
  "Content-Type": "application/json",
};

export const acceptJsonHeader = {
  Accept: "application/json",
};

export const contentMultipartHeader = {
  "Content-Type": "multipart/form-data",
  Accept: "application/json",
};

export const Tags = {
  me: () => "me" as const,
  getLip: <T extends number>(id: T) => `getLip-${id}` as const,
} as const;
export type Tag = ReturnType<(typeof Tags)[keyof typeof Tags]>;

export const helpEmail = "assistenza@smartbroker.space";

export const NEXT_404_ERROR_MESSAGE = "NEXT_HTTP_ERROR_FALLBACK;404";
