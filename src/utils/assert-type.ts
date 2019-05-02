import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

export class TypeValidationError extends Error {
  public errors: t.ValidationError[];

  constructor(errors: t.ValidationError[]) {
    const message = failure(errors).join(',');
    super(message);
    this.errors = errors;
  }
}

export function assertType<T>(expected: t.Type<T>, actual: unknown): T {
  return expected.decode(actual).getOrElseL(errors => {
    throw new TypeValidationError(errors);
  });
}
