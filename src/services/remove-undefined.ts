/**
 * Drops all keys in `o` that have the value `undefined`. This is useful because
 * TypeORM treats an update of `{ bar: 1, foo: undefined }` as setting `foo`
 * column to `NULL`, contrary to `{ bar: 1 }` which would not update the `foo`
 * column.
 *
 * @param o - An object
 * @returns An object without any properties that have the value `undefined`
 */
export function removeUndefined<T>(o: T): Partial<T> {
  let ret: { [key: string]: unknown } = o;
  if (typeof o === 'object') {
    ret = {};
    for (const [key, value] of Object.entries(o)) {
      if (value !== undefined) {
        ret[key] = value;
      }
    }
  }
  return ret as Partial<T>;
}
