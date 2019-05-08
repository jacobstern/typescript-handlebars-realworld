import express, { Request, Response } from 'express';
import marked from 'marked';
import { ensureLoggedIn } from 'connect-ensure-login';
import { StatusError } from '../errors';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { User } from '../entities/User';

const router = express.Router();

router.get('/:slug', async (req: Request, res: Response) => {
  const user = req.user as User;
  const repo = req.entityManager.getCustomRepository(ArticleRepository);
  const article = await repo.findBySlug(req.params.slug);
  if (article == null) {
    throw new StatusError('Article Not Found', 404);
  }

  let favorited = false;
  if (user) {
    const favorites = await user.favorites;
    favorited = favorites.some(favorite => favorite.id === article.id);
  }

  res.render('article', {
    title: article.title,
    user: req.user,
    article: {
      ...article,
      mine: req.user != null && req.user.id === article.author.id,
      html: marked(article.body, { sanitize: true }),
      favorited,
    },
  });
});

router.post(
  '/:slug/delete',
  ensureLoggedIn(),
  async (req: Request, res: Response) => {
    const repo = req.entityManager.getCustomRepository(ArticleRepository);
    const article = await repo.findBySlug(req.params.slug);
    if (article == null) {
      throw new StatusError('Article Not Found', 404);
    }
    if (req.user.id !== article.author.id) {
      throw new StatusError('Forbidden', 403);
    }
    await repo.delete(article);
    res.redirect('/');
  }
);

export default router;
