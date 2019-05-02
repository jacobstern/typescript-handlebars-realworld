import { validateOrReject, ValidationError } from 'class-validator';
import { PlainObject } from './plain-object';
import { MultiValidationError } from './MultiValidationError';
import { isArray } from 'util';

export async function validateHelper<T>(
  form: T,
  values: PlainObject<T>
): Promise<T> {
  Object.assign(form, values);
  try {
    await validateOrReject(form);
    return form;
  } catch (e) {
    if (isArray(e) && e[0] instanceof ValidationError) {
      throw new MultiValidationError(e);
    }
    throw e;
  }
}
