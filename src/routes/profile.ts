import express, { Request, Response } from 'express';
import { StatusError } from '../errors';
import { User } from '../entities/User';
import { ArticleRepository, ListOptions } from '../repositories/ArticleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { stringUnionHash } from '../utils/handlebars-data';

const router = express.Router();

type Filter = 'mine' | 'favorited';

router.get('/:username', async (req: Request, res: Response) => {
  const userRepo = req.entityManager.getCustomRepository(UserRepository);
  const articleRepo = req.entityManager.getCustomRepository(ArticleRepository);
  const user = req.user as User;
  const profile = await userRepo.findByUsername(req.params.username);

  if (profile === undefined) {
    throw new StatusError('User Not Found', 404);
  }

  let filter: Filter = 'mine';

  if (req.query.filter === 'favorited') {
    filter = 'favorited';
  }

  let listOptions: ListOptions = {};
  switch (filter) {
    case 'favorited':
      listOptions = { favoritedBy: profile };
      break;
    default:
    case 'mine':
      listOptions = { author: profile };
      break;
  }

  const articles = await articleRepo.list(listOptions);

  let userProfile = false;
  let following = false;

  if (user) {
    userProfile = user.id === profile.id;
    if (!userProfile) {
      following = (await user.following).some(user => user.id === profile.id);
    }
  }

  const favoritesSet = new Set();
  if (user != null) {
    for (const favorite of await user.favorites) {
      favoritesSet.add(favorite.slug);
    }
  }

  res.render('profile', {
    user,
    nav: { userProfile },
    profile: { ...profile, following, mine: userProfile },
    articles: articles.map(article => ({
      ...article,
      favorited: favoritesSet.has(article.slug),
    })),
    filter: stringUnionHash(filter),
    postRedirect: req.originalUrl,
    extraScripts: ['/build/favorite-button.js', '/build/follow-button.js'],
  });
});

export default router;
