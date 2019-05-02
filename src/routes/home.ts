import express, { Request, Response } from 'express';
import * as t from 'io-ts';
import { listPopularTags, listArticles } from '../services/articles';
import { assertType } from '../utils/assert-type';

const router = express.Router();

const QueryParamsType = t.partial({
  filter: t.string,
  tag: t.string,
});

type Filter = 'global' | 'following' | 'tag';

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

  const { articles } = await listArticles({ tag });

  res.render('home', {
    title: 'Home',
    nav: { home: true },
    user: req.user,
    popularTags: await listPopularTags(),
    articles,
    yourFeed: filter === 'following',
    globalFeed: filter === 'global',
    tag,
  });
});

export default router;
