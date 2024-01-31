interface AppError {
  code: number;
  message: string;
  stack?: string;
}

export enum ErrorCodes {
  ID_FILE_TOO_BIG = 10,
  ID_FILE_MULTIPLE = 11,
  ID_FILE_NOT_VALID = 12,
}

export const errors: Record<ErrorCodes, AppError> = {
  [ErrorCodes.ID_FILE_TOO_BIG]: {
    code: ErrorCodes.ID_FILE_TOO_BIG,
    message: "Il file selezionato è troppo grande (dimensione massima 8 MB)",
  },
  [ErrorCodes.ID_FILE_MULTIPLE]: {
    code: ErrorCodes.ID_FILE_MULTIPLE,
    message: "È possibile caricare un solo file alla volta",
  },
  [ErrorCodes.ID_FILE_NOT_VALID]: {
    code: ErrorCodes.ID_FILE_NOT_VALID,
    message: "Il file caricato non è valido",
  },
};
