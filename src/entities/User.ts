import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from 'typeorm';
import bcrypt from 'bcrypt';
import {
  IsEmail,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validator,
  Validate,
  MinLength,
} from 'class-validator';
import { Article } from './Article';
import { findUserByEmail, findUserByUsername } from '../services/accounts';

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
    const user = args.object as Record<string, unknown>;
    if (typeof user.id === 'number') {
      return found.id === user.id; // Already claimed, by this User
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
    if (found == null) {
      return true;
    }
    const user = args.object as Record<string, unknown>;
    if (typeof user.id === 'number') {
      return found.id === user.id; // Already claimed, by this User
    }
    return false;
  }

  defaultMessage() {
    return 'email $value is already in use';
  }
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @MinLength(3)
  @Validate(UsernameAvailableConstraint)
  @Column({ unique: true, type: 'citext' })
  username: string;

  @IsEmail()
  @Validate(EmailAvailableConstraint)
  @Column({ unique: true, type: 'citext' })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @OneToMany(_type => Article, article => article.author)
  articles: Promise<Article[]>;

  @ManyToMany(_type => User, user => user.following)
  followers: Promise<User[]>;

  @ManyToMany(_type => User, user => user.followers)
  @JoinTable()
  following: Promise<User[]>;

  @ManyToMany(_type => Article, article => article.favoritedBy)
  @JoinTable()
  favorites: Promise<Article[]>;

  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
