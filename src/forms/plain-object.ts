/**
 * Generate a new type with just the known properties of `T`, eliminating the
 * identity of `T` as a specific class.
 */
export type PlainObject<T> = { [K in keyof T]: T[K] };
