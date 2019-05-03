import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import * as t from 'io-ts';
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
import { assertType } from '../utils/assert-type';

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

const PostBodyType = t.type({
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: t.union([t.array(t.string), t.undefined]),
});

router.post('/', ensureLoggedIn(), async (req: Request, res: Response) => {
  const postBody = assertType(PostBodyType, req.body);
  try {
    const form = await ArticleForm.validate(postBody);
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
  const postBody = assertType(PostBodyType, req.body);
  if (postBody.tagList === undefined) {
    // Missing tags list represents empty array in this case
    postBody.tagList = [];
  }
  try {
    const form = await ArticleForm.validate(postBody);
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
