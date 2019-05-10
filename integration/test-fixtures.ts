import { getManager } from 'typeorm';
import { User } from '../src/entities/User';

export async function addFixtures() {
  const user = new User();

  user.email = 'test@gmail.com';
  user.username = 'testuser';
  user.password = 'password';

  await getManager().save(User, user);
}
