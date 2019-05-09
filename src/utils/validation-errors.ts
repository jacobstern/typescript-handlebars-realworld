import { ValidationError } from 'class-validator';
import { isArray } from 'util';

export function isValidationErrorArray(e: unknown): e is ValidationError[] {
  return isArray(e) && e[0] instanceof ValidationError;
}

/**
 * Collect error messages from an array of `class-validator` errors.
 */
export function collectErrorMessages(errors: ValidationError[]): string[] {
  const errorMessages: string[] = [];
  for (const error of errors) {
    for (const message of Object.values(error.constraints)) {
      errorMessages.push(message);
    }
  }
  return errorMessages;
}
