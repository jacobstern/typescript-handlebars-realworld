import { getManager, createQueryBuilder } from 'typeorm';
import shortid from 'shortid';
import slug from 'slug';
import * as t from 'io-ts';
import { ArticleForm } from '../forms/ArticleForm';
import { Article } from '../entities/Article';
import { User } from '../entities/User';
import { getEntityUpdates } from './get-entity-updates';
import { assertType } from '../utils/assert-type';

function generateSlug(title: string): string {
  return [slug(title), shortid.generate()].join('-');
}

export async function createArticle(
  user: User,
  form: ArticleForm
): Promise<Article> {
  const manager = getManager();
  const newArticle = manager.create(Article, {
    title: form.title,
    description: form.description,
    body: form.body,
    tagList: form.tagList || [],
    slug: generateSlug(form.title),
  });
  newArticle.author = user;
  return manager.save(newArticle);
}

export async function findArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  return await getManager().findOne(Article, { slug });
}

export async function deleteArticle(article: Article): Promise<void> {
  await getManager().remove(article);
}

export async function updateArticle(
  article: Article,
  form: ArticleForm
): Promise<void> {
  const updates = getEntityUpdates(article, {
    title: form.title,
    description: form.description,
    body: form.body,
    tagList: form.tagList || [],
  });
  if (updates.title !== undefined) {
    updates.slug = generateSlug(updates.title);
  }
  const manager = getManager();
  const updated = manager.merge(Article, article, updates);
  await manager.save(updated);
}

const TagsAggregateType = t.array(
  t.type({
    tag_count: t.string,
    tag: t.string,
  })
);

export type Tag = string;

export async function listPopularTags(): Promise<Tag[]> {
  const rawResult = await getManager()
    .query(`select count(*) as tag_count, ut.tag
from article, lateral unnest(article.tags) as ut(tag)
group by ut.tag
order by tag_count desc limit 15`);
  return assertType(TagsAggregateType, rawResult).map(row => row.tag);
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
    .leftJoinAndSelect('article.author', 'author')
    .offset(offset)
    .limit(limit)
    .orderBy('article.createdAt', 'DESC')
    .getManyAndCount();
  return {
    count,
    articles,
  };
}
