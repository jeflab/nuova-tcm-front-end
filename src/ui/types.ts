import {ReactNode} from "react";

export interface WithChildren {
  children?: ReactNode;
}

type Identity<T> = T extends object ? {[K in keyof T]: T[K]} : T;

type Prettify<T> = {[K in keyof T]: T[K]} & {};
