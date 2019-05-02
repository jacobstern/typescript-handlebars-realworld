import { getManager } from 'typeorm';
import shortid from 'shortid';
import slug from 'slug';
import * as t from 'io-ts';
import { ArticleForm } from '../forms/ArticleForm';
import { Article } from '../entities/Article';
import { User } from '../entities/User';
import { getEntityUpdates } from './get-entity-updates';
import { assertType } from '../utils/assert-type';

export type ArticleRelation = 'author';

function generateSlug(title: string): string {
  return [shortid.generate(), slug(title)].join('-');
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
    tags: form.tags || [],
    slug: generateSlug(form.title),
  });
  newArticle.author = user;
  return manager.save(newArticle);
}

export interface FindArticleOptions {
  relations: ArticleRelation[];
}

export async function findArticleBySlug(
  slug: string,
  options: FindArticleOptions = { relations: [] }
): Promise<Article | undefined> {
  return await getManager().findOne(
    Article,
    { slug },
    { relations: options.relations }
  );
}

export async function updateArticle(
  article: Article,
  form: ArticleForm
): Promise<void> {
  const updates = getEntityUpdates(article, {
    title: form.title,
    description: form.description,
    body: form.body,
    tags: form.tags || [],
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

export async function listPopularTags(): Promise<string[]> {
  const rawResult = await getManager()
    .query(`select count(*) as tag_count, ut.tag
from article, lateral unnest(article.tags) as ut(tag)
group by ut.tag
order by tag_count desc limit 15`);
  return assertType(TagsAggregateType, rawResult).map(row => row.tag);
}
