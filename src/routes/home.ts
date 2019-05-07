import express, { Request, Response } from 'express';
import {
  listPopularTags,
  feedArticles,
  listArticles,
  ListArticlesResult,
} from '../services/articles';

const router = express.Router();

type Filter = 'global' | 'following' | 'tag';

router.get('/', async (req: Request, res: Response) => {
  const queryParams = req.query as Record<string, string>;

  let filter: Filter = req.user ? 'following' : 'global';
  let tag: string;

  switch (queryParams.filter) {
    case 'following':
      filter = 'following';
      break;
    case 'global':
      filter = 'global';
      break;
    case 'tag':
      if (queryParams.tag) {
        filter = 'tag';
        tag = queryParams.tag;
      }
  }

  if (filter === 'following' && req.user == null) {
    return res.redirect('/');
  }

  let result: ListArticlesResult;

  switch (filter) {
    case 'following':
      result = await feedArticles(req.user);
      break;
    case 'tag':
      result = await listArticles({ tag });
      break;
    case 'global':
    default:
      result = await listArticles();
      break;
  }

  const filterHash: Record<string, boolean> = {};
  filterHash[filter] = true;

  const { articles } = result;

  res.render('home', {
    title: 'Home',
    nav: { home: true },
    user: req.user,
    popularTags: await listPopularTags(),
    articles,
    filter: filterHash,
    tag,
  });
});

export default router;
