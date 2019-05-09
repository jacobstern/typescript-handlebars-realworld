import bcrypt from 'bcrypt';
import { EntityRepository, AbstractRepository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { User } from '../entities/User';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  async find(id: number): Promise<User> {
    return this.manager.findOne(User, id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.manager.findOne(User, { email });
  }

  async findByUsername(username: string): Promise<User> {
    return this.manager.findOne(User, { username });
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    const user = await this.manager.findOne(
      User,
      { email },
      { select: ['id', 'username', 'email', 'password', 'bio', 'image'] }
    );
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      return user;
    }
  }

  async validateAndSave(user: User): Promise<void> {
    await validateOrReject(user, { skipMissingProperties: true });
    await this.manager.save(User, user);
  }
}
