/**
 * This monster renames the given keys with the string set as the value
 *
 * @example
 * type RenamedObject = MapKeys<[object to rename], {
 *  [key to rename]: [renamed key name]
 * }>
 */
export type MapKeys<T extends object, M extends Record<keyof M, keyof any>> = {
  [K in keyof T]-?: (
    a: {
      [P in K extends keyof M ? M[K] : K]: T[K];
    }
  ) => void;
}[keyof T] extends (a: infer U) => void
  ? {
      [K in keyof U]: U[K];
    }
  : never;
