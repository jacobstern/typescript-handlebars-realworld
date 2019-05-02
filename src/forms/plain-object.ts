type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

/**
 * Generate a new type with just the non-function properties of `T`.
 */
export type PlainObject<T> = Pick<T, NonFunctionPropertyNames<T>>;
