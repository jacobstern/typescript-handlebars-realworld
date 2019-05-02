export type EmptyToOptional<T> = {
  [k in keyof T]: T[k] extends string ? T[k] | undefined : T[k]
};

/**
 * Sets properties in `o` whose values are the empty string `''` to `undefined`.
 *
 * @param o - An object
 * @returns An object without any properties that have the value `''`
 */
export function emptyToOptional<T>(o: T): EmptyToOptional<T> {
  let ret: { [key: string]: unknown } = o;
  if (typeof o === 'object') {
    ret = {};
    for (const [key, value] of Object.entries(o)) {
      if (typeof value !== 'string' || value.length > 0) {
        ret[key] = value;
      }
    }
  }
  return ret as EmptyToOptional<T>;
}
