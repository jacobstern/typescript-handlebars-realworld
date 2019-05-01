import { ValidationError } from 'class-validator';

export class MultiValidationError extends Error {
  public readonly errors: ValidationError[];

  public constructor(errors: ValidationError[]) {
    super(`Validation failed with errors: ${errors}`);
    this.errors = errors;
  }
}
