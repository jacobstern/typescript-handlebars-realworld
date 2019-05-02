import deepEqual from 'fast-deep-equal';

/**
 * Returns a subset of `r`, a hash of updates to `l`, such that those updates
 * are not `undefined` and are different from their corresponding values in `l`.
 *
 * Example:
 * ```ts
 * const updates = getEntityUpdates(
 *   { name: 'Jake', email: 'jacob.stern@foo.com', password: 'wjG03' },
 *   { name: 'Jake', email: 'jacob.stern@bar.com' }
 * );
 * expect(updates).toEqual({ email: 'jacob.stern@bar.com' });
 * ```
 *
 * @param l - An entity that will be updated
 * @param r - A hash of updates to `l`
 * @returns A subset of `r` representing meaningful updates to `l`
 */
export function getEntityUpdates<T>(l: T, r: Partial<T>): Partial<T> {
  let ret: { [key: string]: unknown } = r;
  if (typeof r === 'object') {
    ret = {};
    const compare = l as { [key: string]: unknown };
    for (const [key, value] of Object.entries(r)) {
      if (value !== undefined && !deepEqual(value, compare[key])) {
        ret[key] = value;
      }
    }
  }
  return ret as Partial<T>;
}
