import express, { Request, Response } from 'express';
import marked from 'marked';
import { findArticleBySlug, deleteArticle } from '../services/articles';
import { StatusError } from '../errors';
import { ensureLoggedIn } from 'connect-ensure-login';

const router = express.Router();

router.get('/:slug', async (req: Request, res: Response) => {
  const article = await findArticleBySlug(req.params.slug);
  if (article === undefined) {
    throw new StatusError('Article Not Found', 404);
  }
  res.render('article', {
    title: article.title,
    user: req.user,
    article,
    isOwnArticle: req.user != null && req.user.id === article.author.id,
    articleHTML: marked(article.body, { sanitize: true }),
  });
});

router.post(
  '/:slug/delete',
  ensureLoggedIn(),
  async (req: Request, res: Response) => {
    const article = await findArticleBySlug(req.params.slug);
    if (article === undefined) {
      throw new StatusError('Article Not Found', 404);
    }
    if (req.user.id !== article.author.id) {
      throw new StatusError('Forbidden', 403);
    }
    await deleteArticle(article);
    res.redirect('/');
  }
);

export default router;
