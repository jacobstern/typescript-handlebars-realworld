import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import { ArticleForm } from '../forms/ArticleForm';
import { MultiValidationError } from '../forms/MultiValidationError';
import {
  createArticle,
  findArticleBySlug,
  updateArticle,
} from '../services/articles';
import { User } from '../entities/User';
import { collectErrorMessages } from '../utils/collect-error-messages';
import { StatusError } from '../errors';

const router = express.Router();

router.get('/', ensureLoggedIn(), (req: Request, res: Response) => {
  res.render('editor', {
    title: 'New post',
    nav: { newPost: true },
    user: req.user,
  });
});

router.get('/:slug', ensureLoggedIn(), async (req: Request, res: Response) => {
  const article = await findArticleBySlug(req.params.slug);
  if (article === undefined) {
    throw new StatusError('Article Not Found', 404);
  }
  if (req.user.id !== article.author.id) {
    throw new StatusError('Forbidden', 403);
  }
  res.render('editor', {
    title: 'Edit post',
    user: req.user,
    article,
  });
});

router.post('/', ensureLoggedIn(), async (req: Request, res: Response) => {
  try {
    const form = await ArticleForm.validate(req.body);
    const article = await createArticle(req.user as User, form);
    res.redirect(`/article/${article.slug}`);
  } catch (e) {
    if (e instanceof MultiValidationError) {
      res.render('editor', {
        title: 'New post',
        nav: { newPost: true },
        user: req.user,
        article: req.body,
        errorMessages: collectErrorMessages(e.errors),
      });
    } else {
      throw e;
    }
  }
});

router.post('/:slug', ensureLoggedIn(), async (req: Request, res: Response) => {
  const article = await findArticleBySlug(req.params.slug);
  if (article === undefined) {
    throw new StatusError('Article Not Found', 404);
  }
  if (req.user.id !== article.author.id) {
    throw new StatusError('Forbidden', 403);
  }
  try {
    const form = await ArticleForm.validate(req.body);
    await updateArticle(article, form);
    res.redirect(`/article/${article.slug}`);
  } catch (e) {
    if (e instanceof MultiValidationError) {
      res.render('editor', {
        title: 'Edit post',
        user: req.user,
        article: req.body,
        errorMessages: collectErrorMessages(e.errors),
      });
    } else {
      throw e;
    }
  }
});

export default router;
