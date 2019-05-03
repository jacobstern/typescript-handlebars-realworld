import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';
import { isRight } from 'fp-ts/lib/Either';

export class TypeValidationError extends Error {
  public readonly errors: t.ValidationError[];
  public readonly prettyErrors: string[];

  constructor(errors: t.ValidationError[]) {
    const prettyErrors = failure(errors);
    let message = prettyErrors[0];
    if (prettyErrors.length > 1) {
      message += `, and ${prettyErrors.length - 1} more`;
    }
    super(message);
    this.errors = errors;
    this.prettyErrors = prettyErrors;
  }
}

export function assertType<T>(expected: t.Type<T>, actual: unknown): T {
  const result = expected.decode(actual);
  if (isRight(result)) {
    return result.value;
  } else {
    throw new TypeValidationError(result.value);
  }
}
