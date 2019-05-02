import {
  MinLength,
  IsEmail,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  Validator,
  IsOptional,
  IsUrl,
  ValidationArguments,
} from 'class-validator';
import { validateHelper } from './validate-helper';
import { PlainObject } from './plain-object';
import { findUserByUsername, findUserByEmail } from '../services/accounts';

@ValidatorConstraint({ name: 'usernameAvailable', async: true })
class UsernameAvailableConstraint implements ValidatorConstraintInterface {
  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    if (typeof value !== 'string') {
      return false;
    }
    if (value.length === 0) {
      // Short-circuit if username is clearly not valid
      return true;
    }
    const found = await findUserByUsername(value);
    if (found === undefined) {
      return true;
    }
    const form = args.object;
    if (form instanceof UserUpdatesForm) {
      return found.id === form.getUserId();
    }
    return false;
  }

  defaultMessage() {
    return 'username $value is already in use';
  }
}

@ValidatorConstraint({ name: 'emailAvailable', async: true })
class EmailAvailableConstraint implements ValidatorConstraintInterface {
  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    if (typeof value !== 'string') {
      return false;
    }
    if (!new Validator().isEmail(value)) {
      // Validations don't short circuit, so just stop here if it's not a valid email
      return true;
    }
    const found = await findUserByEmail(value);
    if (found === undefined) {
      return true;
    }
    const form = args.object;
    if (form instanceof UserUpdatesForm) {
      return found.id === form.getUserId();
    }
    return false;
  }

  defaultMessage() {
    return 'email $value is already in use';
  }
}

class UserFormBase {
  @MinLength(3)
  @Validate(UsernameAvailableConstraint)
  public readonly username?: string;

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

  private userId: number;

  public getUserId(): number {
    return this.userId;
  }

  @IsOptional()
  public readonly username?: string;

  @IsOptional()
  public readonly email?: string;

  @IsOptional()
  @IsUrl()
  public readonly image?: string;

  @IsOptional()
  public readonly bio?: string;

  private constructor(userId: number) {
    super();
    this.userId = userId;
  }

  public static async validate(
    userId: number,
    form: PlainObject<UserUpdatesForm>
  ): Promise<UserUpdatesForm> {
    return validateHelper(new UserUpdatesForm(userId), form);
  }
}
