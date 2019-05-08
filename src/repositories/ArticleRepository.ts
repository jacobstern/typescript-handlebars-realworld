import { EntityRepository, AbstractRepository, SelectQueryBuilder } from 'typeorm';
import { Article } from '../entities/Article';
import { validateOrReject } from 'class-validator';
import { User } from '../entities/User';

export interface BaseOptions {
  offset?: number;
  limit?: number;
}

export interface ListOptions extends BaseOptions {
  tag?: string;
  author?: User;
  favoritedBy?: User;
}

@EntityRepository(Article)
export class ArticleRepository extends AbstractRepository<Article> {
  private baseQuery(options: BaseOptions): SelectQueryBuilder<Article> {
    const query = this.createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .orderBy('article.createdAt', 'DESC');
    if (options.offset != null) {
      query.offset(options.offset);
    }
    if (options.limit != null) {
      query.limit(options.limit);
    }
    return query;
  }

  private listQuery(options: ListOptions): SelectQueryBuilder<Article> {
    const query = this.baseQuery(options);
    const tagWhereClause = 'article."tagList" @> ARRAY [:tag]';
    if (options.author != null) {
      query.where({ author: options.author });
      if (options.tag != null) {
        query.andWhere(tagWhereClause, { tag: options.tag });
      }
    } else if (options.tag != null) {
      query.where(tagWhereClause, { tag: options.tag });
    }
    if (options.favoritedBy) {
      query.innerJoin(
        'user_favorites_article',
        'favorites',
        'favorites.userId = :userId AND favorites.articleId = article.id',
        { userId: options.favoritedBy.id }
      );
    }
    return query;
  }

  private listFeedQuery(user: User, options: BaseOptions): SelectQueryBuilder<Article> {
    const query = this.baseQuery(options);
    query.innerJoin(
      'user_following_user',
      'following',
      'following.userId_1 = :userId AND following.userId_2 = author.id',
      { userId: user.id }
    );
    return query;
  }

  async findBySlug(slug: string): Promise<Article> {
    return await this.manager.findOne(Article, { slug });
  }

  async remove(article: Article): Promise<void> {
    await this.manager.remove(Article, article);
  }

  async validateAndSave(article: Article): Promise<void> {
    await validateOrReject(article);
    await this.manager.save(Article, article);
  }

  async list(options: ListOptions = {}): Promise<Article[]> {
    return await this.listQuery(options).getMany();
  }

  async listAndCount(options: ListOptions = {}): Promise<[Article[], number]> {
    return await this.listQuery(options).getManyAndCount();
  }

  async listFeed(user: User, options: BaseOptions = {}): Promise<Article[]> {
    return await this.listFeedQuery(user, options).getMany();
  }

  async listFeedAndCount(user: User, options: BaseOptions = {}): Promise<[Article[], number]> {
    return await this.listFeedQuery(user, options).getManyAndCount();
  }

  async listPopularTags(): Promise<string[]> {
    const rawResult = await this.manager.query(`select count(*) as tagCount, ut.tag
from article, lateral unnest(article."tagList") as ut(tag)
group by ut.tag
order by tagCount desc limit 15`);
    return rawResult.map((row: any) => row.tag);
  }
}
