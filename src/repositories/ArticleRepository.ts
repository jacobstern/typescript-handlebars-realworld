import { EntityRepository, AbstractRepository } from 'typeorm';
import { Article } from '../entities/Article';
import { validateOrReject } from 'class-validator';

@EntityRepository(Article)
export class ArticleRepository extends AbstractRepository<Article> {
  async findBySlug(slug: string): Promise<Article> {
    return await this.manager.findOne(Article, { slug });
  }

  async delete(article: Article): Promise<void> {
    await this.manager.delete(Article, article);
  }

  async validateAndSave(article: Article): Promise<void> {
    await validateOrReject(article);
    await this.manager.save(Article, article);
  }
}
