import {
  MinLength,
  IsEmail,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  Validator,
  IsOptional,
  IsUrl,
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
    if (value.length === 0) {
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

class UserFormBase {
  @IsOptional()
  @MinLength(3)
  @Validate(UsernameAvailableConstraint)
  public readonly username?: string;

  @IsOptional()
  @IsEmail()
  @Validate(EmailAvailableConstraint)
  public readonly email?: string;

  @IsOptional()
  @MinLength(8)
  public readonly password?: string;

  protected constructor() {}
}

export class UserForm extends UserFormBase {
  private __nominal: void;

  public readonly username: string;

  public readonly email: string;

  public readonly password: string;

  private constructor() {
    super();
  }

  public static async validate(form: PlainObject<UserForm>): Promise<UserForm> {
    return validateHelper(new UserForm(), form);
  }
}

export class UserUpdatesForm extends UserFormBase {
  private __nominal: void;

  @IsOptional()
  public readonly image?: string;

  @IsOptional()
  @IsUrl()
  public readonly bio?: string;

  private constructor() {
    super();
  }

  public static async validate(
    form: PlainObject<UserUpdatesForm>
  ): Promise<UserUpdatesForm> {
    return validateHelper(new UserUpdatesForm(), form);
  }
}
