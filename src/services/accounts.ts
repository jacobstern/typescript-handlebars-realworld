import bcrypt from 'bcrypt';
import { getManager } from 'typeorm';
import { User } from '../entities/User';
import { UserForm, UserUpdatesForm } from '../forms/UserForm';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function createUser(form: UserForm): Promise<User> {
  const manager = getManager();
  const newUser = manager.create(User, {
    username: form.username,
    email: form.email,
    password: await hashPassword(form.password),
  });
  return manager.save(newUser);
}

export async function isEmailAvailable(email: string): Promise<boolean> {
  return await getManager()
    .findOne(User, { email })
    .then(found => found === undefined);
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  return await getManager()
    .findOne(User, { username })
    .then(found => found === undefined);
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  return await getManager().findOne(User, { email });
}

export async function findUserByUsername(
  username: string
): Promise<User | undefined> {
  return await getManager().findOne(User, { username });
}

export async function findUser(id: number): Promise<User | undefined> {
  return await getManager().findOne(User, { id });
}

export async function updateUser(
  id: number,
  updates: UserUpdatesForm
): Promise<void> {
  if (Object.keys(updates).length > 0) {
    await getManager().update(User, { id }, updates);
  }
}
