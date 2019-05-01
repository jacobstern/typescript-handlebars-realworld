import { MinLength, IsEmail } from 'class-validator';
import { validateHelper } from './validate-helper';
import { PlainObject } from './plain-object';

export class RegisterForm {
  @MinLength(3)
  public readonly username: string;

  @IsEmail()
  public readonly email: string;

  @MinLength(7)
  public readonly password: string;

  private constructor() {}

  public static async validate(form: PlainObject<RegisterForm>): Promise<RegisterForm> {
    return validateHelper(new RegisterForm(), form);
  }
}
