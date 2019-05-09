/**
 * Helper to generate a Handlebars-friendly hash representing a string union
 * type.
 *
 * @param value - A string inhabiting a union type
 * @returns A hash (object) with the key `value` set to `true`
 */
export function stringUnionHash(value: string): Record<string, boolean> {
  return {
    [value]: true,
  };
}
