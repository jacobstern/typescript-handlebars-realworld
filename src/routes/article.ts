import express, { Request, Response } from 'express';
import marked from 'marked';
import { ensureLoggedIn } from 'connect-ensure-login';
import { StatusError } from '../errors';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { User } from '../entities/User';
import { CommentRepository } from '../repositories/CommentRepository';
import { Comment } from '../entities/Comment';
import { isValidationErrorArray, collectErrorMessages } from '../utils/validation-errors';

const router = express.Router();

router.get('/:slug', async (req: Request, res: Response) => {
  const user = req.user as User;
  const articleRepo = req.entityManager.getCustomRepository(ArticleRepository);
  const commentRepo = req.entityManager.getCustomRepository(CommentRepository);
  const article = await articleRepo.findBySlug(req.params.slug);
  if (article == null) {
    throw new StatusError('Article Not Found', 404);
  }

  let favorited = false;
  if (user) {
    const favorites = await user.favorites;
    favorited = favorites.some(favorite => favorite.id === article.id);
  }

  const comments = await commentRepo.list({ article });

  res.render('article', {
    title: article.title,
    user,
    article: {
      ...article,
      mine: user != null && user.id === article.author.id,
      html: marked(article.body, { sanitize: true }),
      favorited,
      comments: comments.map(comment => ({
        ...comment,
        mine: user != null && comment.author.id === user.id,
      })),
    },
    errorMessages: req.flash('error'),
  });
});

router.post('/:slug/delete', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(ArticleRepository);
  const article = await repo.findBySlug(req.params.slug);
  if (article == null) {
    throw new StatusError('Article Not Found', 404);
  }
  if (req.user.id !== article.author.id) {
    throw new StatusError('Forbidden', 403);
  }
  await repo.remove(article);
  res.redirect('/');
});

interface CommentPostBody {
  body: string;
}

router.post('/:slug/comments', ensureLoggedIn(), async (req: Request, res: Response) => {
  const postBody = req.body as CommentPostBody;

  const articleRepo = req.entityManager.getCustomRepository(ArticleRepository);
  const commentRepo = req.entityManager.getCustomRepository(CommentRepository);

  const article = await articleRepo.findBySlug(req.params.slug);
  if (article == null) {
    throw new StatusError('Article Not Found', 404);
  }

  const comment = new Comment();
  comment.body = postBody.body;
  comment.article = article;
  comment.author = req.user;

  try {
    await commentRepo.validateAndSave(comment);
  } catch (e) {
    if (isValidationErrorArray(e)) {
      for (const message of collectErrorMessages(e)) {
        req.flash('error', message);
      }
    } else {
      throw e;
    }
  }
  res.redirect(`/article/${encodeURIComponent(article.slug)}`);
});

router.post(
  '/:slug/comments/:id/delete',
  ensureLoggedIn(),
  async (req: Request, res: Response) => {
    const articleRepo = req.entityManager.getCustomRepository(ArticleRepository);
    const commentRepo = req.entityManager.getCustomRepository(CommentRepository);

    const article = await articleRepo.findBySlug(req.params.slug);
    const comment = await commentRepo.find(req.params.id, {
      selectArticle: true,
    });

    if (article == null || comment == null || article.id !== comment.article.id) {
      throw new StatusError('Not found', 404);
    }

    if (comment.author.id !== req.user.id) {
      throw new StatusError('Forbidden', 403);
    }

    await commentRepo.remove(comment);

    res.redirect(`/article/${encodeURIComponent(article.slug)}`);
  }
);

export default router;
