import { validateOrReject } from 'class-validator';
import { PlainObject } from './plain-object';
import { MultiValidationError } from './MultiValidationError';

export async function validateHelper<T>(
  form: T,
  values: PlainObject<T>
): Promise<T> {
  Object.assign(form, values);
  try {
    await validateOrReject(form, { whitelist: true });
    return form;
  } catch (e) {
    throw new MultiValidationError(e);
  }
}
