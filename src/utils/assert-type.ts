import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

export class TypeValidationError extends Error {
  public errors: string[];

  constructor(errors: string[]) {
    const message = errors.join('\n');
    super(message);
    this.errors = errors;
  }
}

export function assertType<T>(expected: t.Type<T>, actual: unknown): T {
  return expected.decode(actual).getOrElseL(errors => {
    throw new TypeValidationError(failure(errors));
  });
}
