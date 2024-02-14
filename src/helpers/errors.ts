interface AppError {
  code: number;
  message: string;
  stack?: string;
  status: "failed";
}

export enum ErrorCodes {
  GENERIC_ERROR = 10,
  INVALID_JSON = 11,
  INVALID_SCHEMA = 12,
  ID_FILE_TOO_BIG = 20,
  ID_FILE_MULTIPLE = 21,
  ID_FILE_NOT_VALID = 22,
}

export const errors: Record<ErrorCodes, AppError> = {
  [ErrorCodes.GENERIC_ERROR]: {
    code: ErrorCodes.GENERIC_ERROR,
    message: "Si è verificato un errore imprevisto, riprova più tardi",
    status: "failed",
  },
  [ErrorCodes.INVALID_JSON]: {
    code: ErrorCodes.INVALID_JSON,
    message: "Il server ha risposto con un JSON non valido",
    status: "failed",
  },
  [ErrorCodes.INVALID_SCHEMA]: {
    code: ErrorCodes.INVALID_SCHEMA,
    message: "Il server ha risposto con uno schema non valido",
    status: "failed",
  },
  [ErrorCodes.ID_FILE_TOO_BIG]: {
    code: ErrorCodes.ID_FILE_TOO_BIG,
    message: "Il file selezionato è troppo grande (dimensione massima 8 MB)",
    status: "failed",
  },
  [ErrorCodes.ID_FILE_MULTIPLE]: {
    code: ErrorCodes.ID_FILE_MULTIPLE,
    message: "È possibile caricare un solo file alla volta",
    status: "failed",
  },
  [ErrorCodes.ID_FILE_NOT_VALID]: {
    code: ErrorCodes.ID_FILE_NOT_VALID,
    message: "Il file caricato non è valido",
    status: "failed",
  },
};

export function normalizeErrorMessage(error: unknown): Error {
  let message: string;

  if (!error) {
    message = errors[ErrorCodes.GENERIC_ERROR].message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = errors[ErrorCodes.GENERIC_ERROR].message;
  }

  return new Error(message);
}
