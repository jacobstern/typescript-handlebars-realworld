import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ArticleEntity } from '../entities/ArticleEntity';
import { User } from '../entities/User';

export interface BasicFindOptions {
  skip?: number;
  take?: number;
}

function applyOptions<T>(
  query: SelectQueryBuilder<T>,
  options: BasicFindOptions = {}
) {
  if (options.skip) {
    query.offset(options.skip);
  }
  if (options.take) {
    query.limit(options.take);
  }
}

@EntityRepository(ArticleEntity)
export class ArticleRepository extends Repository<ArticleEntity> {
  async findAndCountByTag(
    tag: string,
    options?: BasicFindOptions
  ): Promise<[ArticleEntity[], number]> {
    const query = this.createQueryBuilder();
    applyOptions(query, options);
    return query
      .where('article.tags @> ARRAY [:tag]', { tag })
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();
  }

  async findAndCountByFollowing(
    user: User,
    options?: BasicFindOptions
  ): Promise<[ArticleEntity[], number]> {
    const query = this.createQueryBuilder();
    applyOptions(query, options);
    query;
    return query
      .innerJoinAndSelect('article.author', 'author')
      .innerJoin(
        'user_following_user',
        'following',
        'following.userId_1 = :userId AND following.userId_2 = author.id',
        { userId: user.id }
      )
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();
  }
}
