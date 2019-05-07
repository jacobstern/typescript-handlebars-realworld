import { ValidationError } from 'class-validator';
import { isArray } from 'util';

export function isValidationErrorArray(e: unknown): e is ValidationError[] {
  return isArray(e) && e[0] instanceof ValidationError;
}
