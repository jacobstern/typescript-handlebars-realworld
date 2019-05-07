import { getManager, createQueryBuilder } from 'typeorm';
import { Article } from '../entities/Article';
import { User } from '../entities/User';

export type Tag = string;

export async function listPopularTags(): Promise<Tag[]> {
  const rawResult = await getManager()
    .query(`select count(*) as tag_count, ut.tag
from article, lateral unnest(article.tags) as ut(tag)
group by ut.tag
order by tag_count desc limit 15`);
  return rawResult.map((row: any) => row.tag);
}

export interface ListArticlesResult {
  count: number;
  articles: Article[];
}

export interface ListArticlesOptions {
  offset?: number;
  limit?: number;
  tag?: string;
  author?: User;
}

export async function listArticles(
  options: ListArticlesOptions = {}
): Promise<ListArticlesResult> {
  const { offset = 0, limit = 20 } = options;
  const query = createQueryBuilder(Article, 'article');
  if (options.tag) {
    query.where('article.tags @> ARRAY [:tag]', { tag: options.tag });
  }
  if (options.author) {
    query.where({ author: options.author });
  }
  const [articles, count] = await query
    .innerJoinAndSelect('article.author', 'author')
    .offset(offset)
    .limit(limit)
    .orderBy('article.createdAt', 'DESC')
    .getManyAndCount();
  return {
    count,
    articles,
  };
}

export interface ListArticlesFeedOptions {
  offset?: number;
  limit?: number;
}

export async function listArticlesFeed(
  user: User,
  options: ListArticlesFeedOptions = {}
): Promise<ListArticlesResult> {
  const { offset = 0, limit = 20 } = options;
  const query = createQueryBuilder(Article, 'article')
    .innerJoinAndSelect('article.author', 'author')
    .innerJoin(
      'user_following_user',
      'following',
      'following.userId_1 = :userId AND following.userId_2 = author.id',
      { userId: user.id }
    )
    .offset(offset)
    .limit(limit)
    .orderBy('article.createdAt', 'DESC');
  const [articles, count] = await query.getManyAndCount();
  return {
    count,
    articles,
  };
}
