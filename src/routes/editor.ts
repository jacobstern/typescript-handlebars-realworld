import express, { Request, Response } from 'express';
import { validate } from 'class-validator';
import { ensureLoggedIn } from 'connect-ensure-login';
import * as t from 'io-ts';
import { collectErrorMessages } from '../utils/collect-error-messages';
import { StatusError } from '../errors';
import { assertPostBodyType } from '../utils/assert-type';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { generateSlug } from '../article-slugs';
import { optional } from '../utils/type-combinators';
import { Article } from '../entities/Article';

const router = express.Router();

router.get('/', ensureLoggedIn(), (req: Request, res: Response) => {
  res.render('editor', {
    title: 'New post',
    nav: { newPost: true },
    user: req.user,
  });
});

router.get('/:slug', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.dbConnection.getCustomRepository(ArticleRepository);
  const article = await repo.findOne({ slug: req.params.slug });
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
  const repo = req.dbConnection.getCustomRepository(ArticleRepository);
  const postBody = assertPostBodyType(PostBodyType, req.body);
  if (postBody.tagList == null) {
    postBody.tagList = [];
  }
  const article = new Article();
  article.title = postBody.title;
  article.slug = generateSlug(postBody.title);
  article.body = postBody.body;
  article.description = postBody.description;
  article.tagList = postBody.tagList;
  article.author = req.user;
  const validationErrors = await validate(article);
  if (validationErrors.length > 0) {
    res.render('editor', {
      title: 'New post',
      nav: { newPost: true },
      user: req.user,
      article: postBody,
      errorMessages: collectErrorMessages(validationErrors),
    });
  } else {
    await repo.save(article);
    res.redirect(`/article/${article.slug}`);
  }
});

router.post('/:slug', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.dbConnection.getCustomRepository(ArticleRepository);
  const article = await repo.findOne({ slug: req.params.slug });
  if (article == null) {
    throw new StatusError('Article Not Found', 404);
  }
  if (req.user.id !== article.author.id) {
    throw new StatusError('Forbidden', 403);
  }
  const postBody = assertPostBodyType(PostBodyType, req.body);
  if (postBody.tagList == null) {
    postBody.tagList = [];
  }
  if (postBody.title !== article.title) {
    article.title = postBody.title;
    article.slug = generateSlug(postBody.title);
  }
  article.description = postBody.description;
  article.body = postBody.body;
  article.tagList = postBody.tagList;
  const validationErrors = await validate(article);
  if (validationErrors.length > 0) {
    res.render('editor', {
      title: 'Edit post',
      user: req.user,
      article: req.body,
      errorMessages: collectErrorMessages(validationErrors),
    });
  } else {
    await repo.save(article);
    res.redirect(`/article/${article.slug}`);
  }
});

export default router;
