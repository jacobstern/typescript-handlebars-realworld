import express, { Request, Response } from 'express';
import * as t from 'io-ts';
import { findUserByUsername } from '../services/accounts';
import { StatusError } from '../errors';
import { listArticles, ListArticlesOptions } from '../services/articles';
import { assertType } from '../utils/assert-type';

const router = express.Router();

const QueryParamsType = t.partial({
  filter: t.string,
});

type Filter = 'mine' | 'favorited';

router.get('/:username', async (req: Request, res: Response) => {
  const profile = await findUserByUsername(req.params.username);
  if (profile === undefined) {
    throw new StatusError('User Not Found', 404);
  }

  const queryParams = assertType(QueryParamsType, req.query);

  let filter: Filter = 'mine';

  if (queryParams.filter === 'favorited') {
    filter = 'favorited';
  }

  let listArticlesOptions: ListArticlesOptions = {};
  switch (filter) {
    case 'mine':
      listArticlesOptions = { author: profile };
      break;
  }

  const { articles } = await listArticles(listArticlesOptions);

  const isOwnProfile = req.user && req.user.id === profile.id;

  res.render('profile', {
    user: req.user,
    profile,
    nav: { userProfile: isOwnProfile },
    isOwnProfile,
    articles,
    myArticles: filter === 'mine',
    favoritedArticles: filter === 'favorited',
  });
});

export default router;
