import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import { StatusError } from '../errors';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { generateSlug } from '../article-slugs';
import { Article } from '../entities/Article';
import { isValidationErrorArray, collectErrorMessages } from '../utils/validation-errors';

const router = express.Router();

router.get('/', ensureLoggedIn(), (req: Request, res: Response) => {
  res.render('editor', {
    title: 'New post',
    nav: { newPost: true },
    user: req.user,
    extraScripts: ['/build/editor.js'],
  });
});

router.get('/:slug', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(ArticleRepository);
  const article = await repo.findBySlug(req.params.slug);
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
    extraScripts: ['/build/editor.js'],
  });
});

interface PostBody {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

router.post('/', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(ArticleRepository);
  const postBody = req.body as PostBody;
  const article = new Article();
  article.title = postBody.title;
  article.slug = generateSlug(postBody.title);
  article.body = postBody.body;
  article.description = postBody.description;
  article.tagList = postBody.tagList || [];
  article.author = req.user;
  try {
    await repo.validateAndSave(article);
    res.redirect(`/article/${article.slug}`);
  } catch (e) {
    if (isValidationErrorArray(e)) {
      res.render('editor', {
        title: 'New post',
        nav: { newPost: true },
        user: req.user,
        article: postBody,
        errorMessages: collectErrorMessages(e),
        extraScripts: ['/build/editor.js'],
      });
    } else {
      throw e;
    }
  }
});

router.post('/:slug', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(ArticleRepository);
  const article = await repo.findBySlug(req.params.slug);
  const postBody = req.body as PostBody;
  if (article == null) {
    throw new StatusError('Article Not Found', 404);
  }
  if (req.user.id !== article.author.id) {
    throw new StatusError('Forbidden', 403);
  }
  if (postBody.title !== article.title) {
    article.title = postBody.title;
    article.slug = generateSlug(postBody.title);
  }
  article.description = postBody.description;
  article.body = postBody.body;
  article.tagList = postBody.tagList || [];
  try {
    await repo.validateAndSave(article);
    res.redirect(`/article/${article.slug}`);
  } catch (e) {
    if (isValidationErrorArray(e)) {
      res.render('editor', {
        title: 'Edit post',
        user: req.user,
        article: req.body,
        errorMessages: collectErrorMessages(e),
        extraScripts: ['/build/editor.js'],
      });
    } else {
      throw e;
    }
  }
});

export default router;
