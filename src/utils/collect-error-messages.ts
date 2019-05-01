import { ValidationError } from 'class-validator';

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
