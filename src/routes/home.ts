import express, { Request, Response } from 'express';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { Article } from '../entities/Article';
import { User } from '../entities/User';

const router = express.Router();

type Filter = 'global' | 'following' | 'tag';

router.get('/', async (req: Request, res: Response) => {
  const user = req.user as User;
  const queryParams = req.query as Record<string, string>;
  const repo = req.entityManager.getCustomRepository(ArticleRepository);

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

  if (filter === 'following' && req.user == null) {
    res.redirect('/');
  }

  let result: [Article[], number];

  switch (filter) {
    case 'following':
      result = await repo.listFeedAndCount(req.user);
      break;
    case 'tag':
      result = await repo.listAndCount({ tag });
      break;
    case 'global':
    default:
      result = await repo.listAndCount();
  }

  const filterHash: Record<string, boolean> = {};
  filterHash[filter] = true;

  const favoritesSet = new Set();
  if (user != null) {
    for (const favorite of await user.favorites) {
      favoritesSet.add(favorite.slug);
    }
  }

  const [articles] = result;

  res.render('home', {
    title: 'Home',
    nav: { home: true },
    user: req.user,
    popularTags: await repo.listPopularTags(),
    articles: articles.map(article => ({
      ...article,
      favorited: favoritesSet.has(article.slug),
    })),
    filter: filterHash,
    tag,
  });
});

export default router;
