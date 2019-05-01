import bcrypt from 'bcrypt';
import { getManager } from 'typeorm';
import { User } from '../entities/User';
import { RegisterForm } from '../forms/RegisterForm';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function createUser(form: RegisterForm): Promise<User> {
  const manager = getManager();
  const newUser = manager.create(User, {
    username: form.username,
    email: form.email,
    password: await hashPassword(form.password),
  });
  return manager.save(newUser);
}
