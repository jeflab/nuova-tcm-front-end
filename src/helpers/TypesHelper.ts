export type Identity<T> = T extends object ? {[K in keyof T]: T[K]} : T;
export type Prettify<T> = {[K in keyof T]: T[K]} & {};

export type Nullish<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
