import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { getManager } from 'typeorm';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export async function createUser(user: NewUser): Promise<User> {
  const manager = getManager();
  const created = manager.create(User, {
    ...user,
    password: await hashPassword(user.password),
  });
  return manager.save(created);
}
