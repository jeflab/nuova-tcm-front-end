export type Identity<T> = T extends object ? {[K in keyof T]: T[K]} : T;

export type Prettify<T> = {[K in keyof T]: T[K]} & {};
