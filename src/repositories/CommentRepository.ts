import {
  EntityRepository,
  AbstractRepository,
  FindConditions,
  FindOneOptions,
} from 'typeorm';
import { Comment } from '../entities/Comment';
import { validateOrReject } from 'class-validator';
import { Article } from '../entities/Article';

export interface ListOptions {
  article?: Article;
}

export interface FindOptions {
  selectArticle?: boolean;
}

@EntityRepository(Comment)
export class CommentRepository extends AbstractRepository<Comment> {
  async validateAndSave(comment: Comment): Promise<void> {
    await validateOrReject(comment);
    await this.manager.save(Comment, comment);
  }

  async find(id: number, options: FindOptions = {}): Promise<Comment> {
    const findOptions: FindOneOptions<Comment> = {};
    if (options.selectArticle) {
      findOptions.relations = ['author', 'article'];
    }
    return this.manager.findOne(Comment, id, findOptions);
  }

  async list(options: ListOptions = {}): Promise<Comment[]> {
    const conditions: FindConditions<Comment> = {};
    if (options.article !== undefined) {
      conditions.article = options.article;
    }
    return this.manager.find(Comment, {
      where: conditions,
      order: { createdAt: 'DESC' },
    });
  }

  async remove(comment: Comment): Promise<void> {
    await this.manager.remove(Comment, comment);
  }
}
