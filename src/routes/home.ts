import express, { Request, Response } from 'express';
import * as t from 'io-ts';
import {
  listPopularTags,
  ListArticlesResult,
  listArticlesFeed,
  listArticles,
} from '../services/articles';
import { assertType } from '../utils/assert-type';
import { User } from '../entities/User';

const router = express.Router();

const QueryParamsType = t.partial({
  filter: t.string,
  tag: t.string,
});

type Filter = 'global' | 'following' | 'tag';

async function listArticlesForHome(
  filter: Filter,
  tag: string | undefined,
  page: number,
  user?: User
): Promise<ListArticlesResult> {
  if (filter === 'following' && user) {
    return await listArticlesFeed(user);
  } else if (filter === 'tag') {
    return await listArticles({ tag });
  }
  return await listArticles();
}

router.get('/', async (req: Request, res: Response) => {
  const queryParams = assertType(QueryParamsType, req.query);

  let filter: Filter = req.user ? 'following' : 'global';
  let tag: string | undefined = undefined;

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

  if (filter === 'following' && !req.user) {
    res.redirect('/');
  }

  const { articles } = await listArticlesForHome(filter, tag, 0, req.user);

  const filterHash: Record<string, boolean> = {};
  filterHash[filter] = true;

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
