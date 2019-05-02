import { getManager } from 'typeorm';
import shortid from 'shortid';
import slug from 'slug';
import { ArticleForm } from '../forms/ArticleForm';
import { Article } from '../entities/Article';
import { User } from '../entities/User';
import { getEntityUpdates } from './get-entity-updates';

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
