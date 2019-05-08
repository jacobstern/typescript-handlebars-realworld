import { EntityRepository, AbstractRepository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { User } from '../entities/User';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  async validateAndSave(user: User): Promise<void> {
    await validateOrReject(user, { skipMissingProperties: true });
    await this.manager.save(User, user);
  }
}
