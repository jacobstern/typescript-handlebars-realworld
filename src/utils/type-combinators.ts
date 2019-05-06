import * as t from 'io-ts';

/**
 * Utility to represent an `io-ts` property that may be null or undefined
 */
export function optional<C extends t.Mixed>(
  codec: C
): t.UnionC<[C, t.NullC, t.UndefinedC]> {
  return t.union([codec, t.null, t.undefined]);
}
