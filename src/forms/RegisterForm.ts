import {
  MinLength,
  IsEmail,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  Validator,
} from 'class-validator';
import { validateHelper } from './validate-helper';
import { PlainObject } from './plain-object';
import { isUsernameAvailable, isEmailAvailable } from '../services/accounts';

@ValidatorConstraint({ name: 'usernameAvailable', async: true })
class UsernameAvailableConstraint implements ValidatorConstraintInterface {
  async validate(value: unknown): Promise<boolean> {
    if (typeof value !== 'string') {
      return false;
    }
    if (value.length < 3) {
      // Short-circuit if username is clearly not valid
      return true;
    }
    return await isUsernameAvailable(value);
  }

  defaultMessage() {
    return 'username $value is already in use';
  }
}

@ValidatorConstraint({ name: 'emailAvailable', async: true })
class EmailAvailableConstraint implements ValidatorConstraintInterface {
  async validate(value: unknown): Promise<boolean> {
    if (typeof value !== 'string') {
      return false;
    }
    if (!new Validator().isEmail(value)) {
      // Validations don't short circuit, so just stop here if it's not a valid email
      return true;
    }
    return await isEmailAvailable(value);
  }

  defaultMessage() {
    return 'email $value is already in use';
  }
}

export class RegisterForm {
  @MinLength(3)
  @Validate(UsernameAvailableConstraint)
  public readonly username: string;

  @IsEmail()
  @Validate(EmailAvailableConstraint)
  public readonly email: string;

  @MinLength(8)
  public readonly password: string;

  private constructor() {}

  public static async validate(form: PlainObject<RegisterForm>): Promise<RegisterForm> {
    return validateHelper(new RegisterForm(), form);
  }
}
