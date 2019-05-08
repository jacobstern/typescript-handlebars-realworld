import express, { Request, Response } from 'express';
import {
  findUserByUsername,
  followUser,
  unfollowUser,
} from '../services/accounts';
import { StatusError } from '../errors';
import { User } from '../entities/User';
import { ensureLoggedIn } from 'connect-ensure-login';
import {
  ArticleRepository,
  ListOptions,
} from '../repositories/ArticleRepository';

const router = express.Router();

type Filter = 'mine' | 'favorited';

router.post(
  '/:username/follow',
  ensureLoggedIn(),
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const userToFollow = await findUserByUsername(req.params.username);

    if (userToFollow === undefined) {
      throw new StatusError('User not found', 404);
    }

    if (userToFollow.id === user.id) {
      throw new StatusError('Reflexive follow is forbidden', 403);
    }

    await followUser(user, userToFollow);

    if (req.query.redirect) {
      res.redirect(req.query.redirect);
    } else {
      res.redirect(`/profile/${encodeURIComponent(userToFollow.username)}`);
    }
  }
);

router.post(
  '/:username/unfollow',
  ensureLoggedIn(),
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const userToUnfollow = await findUserByUsername(req.params.username);

    if (userToUnfollow === undefined) {
      throw new StatusError('User Not Found', 404);
    }

    await unfollowUser(user, userToUnfollow);

    if (req.query.redirect) {
      res.redirect(req.query.redirect);
    } else {
      res.redirect(`/profile/${encodeURIComponent(userToUnfollow.username)}`);
    }
  }
);

router.get('/:username', async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(ArticleRepository);
  const user = req.user as User;
  const profile = await findUserByUsername(req.params.username);

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

  const articles = await repo.list(listOptions);

  let isUserProfile = false;
  let following = false;

  if (user) {
    isUserProfile = user.id === profile.id;
    if (!isUserProfile) {
      following = (await user.following).some(user => user.id === profile.id);
    }
  }

  const filterHash: Record<string, boolean> = {};
  filterHash[filter] = true;

  const favoritesSet = new Set();
  if (user != null) {
    for (const favorite of await user.favorites) {
      favoritesSet.add(favorite.slug);
    }
  }

  res.render('profile', {
    user,
    nav: { userProfile: isUserProfile },
    profile: { ...profile, following, mine: isUserProfile },
    articles: articles.map(article => ({
      ...article,
      favorited: favoritesSet.has(article.slug),
    })),
    filter: filterHash,
    postRedirect: req.originalUrl,
  });
});

export default router;
