import { getManager, createQueryBuilder } from 'typeorm';
import uniqid from 'uniqid';
import slug from 'slug';
import { ArticleEntity } from '../entities/ArticleEntity';
import { User } from '../entities/User';
import { validateOrReject } from 'class-validator';

export interface ArticleWrite {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface Article extends ArticleWrite {
  id: number;
  slug: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  author: User;
}

function generateSlug(title: string): string {
  return slug(title) + '-' + uniqid();
}

export async function createArticle(
  article: ArticleWrite,
  user: User
): Promise<Article> {
  const manager = getManager();
  const entity = new ArticleEntity();
  entity.title = article.title;
  entity.slug = generateSlug(article.title);
  entity.body = article.body;
  entity.description = article.description;
  entity.tagList = article.tagList || [];
  entity.author = user;
  await validateOrReject(entity);
  return manager.save(entity);
}

export async function findArticleBySlug(slug: string): Promise<Article> {
  return await getManager().findOne(ArticleEntity, { slug });
}

export async function deleteArticle(article: Article): Promise<void> {
  const manager = getManager();
  const entity = await manager.preload(ArticleEntity, article);
  await manager.delete(ArticleEntity, entity);
}

export async function updateArticle(
  article: Article,
  updates: ArticleWrite
): Promise<void> {
  const manager = getManager();
  const entity = await manager.preload(ArticleEntity, article);
  if (updates.title !== entity.title) {
    entity.title = updates.title;
    entity.slug = generateSlug(updates.title);
  }
  entity.description = updates.description;
  entity.body = updates.body;
  entity.tagList = updates.tagList || [];
  await validateOrReject(entity);
  await manager.save(entity);
}

export async function listPopularTags(): Promise<string[]> {
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
  const query = createQueryBuilder(ArticleEntity, 'article');
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

export interface FeedArticlesOptions {
  offset?: number;
  limit?: number;
}

export async function feedArticles(
  user: User,
  options: FeedArticlesOptions = {}
): Promise<ListArticlesResult> {
  const { offset = 0, limit = 20 } = options;
  const query = createQueryBuilder(ArticleEntity, 'article')
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
