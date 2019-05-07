import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import * as t from 'io-ts';
import { collectErrorMessages } from '../utils/collect-error-messages';
import { StatusError } from '../errors';
import { assertPostBodyType } from '../utils/assert-type';
import { optional } from '../utils/type-combinators';
import {
  findArticleBySlug,
  createArticle,
  updateArticle,
} from '../services/articles';
import { isValidationErrorArray } from '../utils/is-validation-error-array';

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
  if (article == null) {
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
  tagList: optional(t.array(t.string)),
});

router.post('/', ensureLoggedIn(), async (req: Request, res: Response) => {
  const postBody = assertPostBodyType(PostBodyType, req.body);
  try {
    const article = await createArticle(postBody, req.user);
    res.redirect(`/article/${article.slug}`);
  } catch (e) {
    if (isValidationErrorArray(e)) {
      res.render('editor', {
        title: 'New post',
        nav: { newPost: true },
        user: req.user,
        article: postBody,
        errorMessages: collectErrorMessages(e),
      });
    } else {
      throw e;
    }
  }
});

router.post('/:slug', ensureLoggedIn(), async (req: Request, res: Response) => {
  const article = await findArticleBySlug(req.params.slug);
  if (article == null) {
    throw new StatusError('Article Not Found', 404);
  }
  if (req.user.id !== article.author.id) {
    throw new StatusError('Forbidden', 403);
  }
  const postBody = assertPostBodyType(PostBodyType, req.body);
  try {
    await updateArticle(article, postBody);
    res.redirect(`/article/${article.slug}`);
  } catch (e) {
    if (isValidationErrorArray(e)) {
      res.render('editor', {
        title: 'Edit post',
        user: req.user,
        article: req.body,
        errorMessages: collectErrorMessages(e),
      });
    } else {
      throw e;
    }
  }
});

export default router;
