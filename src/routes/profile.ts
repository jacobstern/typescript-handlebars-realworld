import express, { Request, Response } from 'express';
import { StatusError } from '../errors';
import { User } from '../entities/User';
import { ensureLoggedIn } from 'connect-ensure-login';
import { ArticleRepository, ListOptions } from '../repositories/ArticleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { stringUnionHash } from '../utils/handlebars-data';

const router = express.Router();

type Filter = 'mine' | 'favorited';

router.post('/:username/follow', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(UserRepository);
  const user = req.user as User;
  const userToFollow = await repo.findByUsername(req.params.username);

  if (userToFollow === undefined) {
    throw new StatusError('User not found', 404);
  }

  if (userToFollow.id === user.id) {
    throw new StatusError('Reflexive follow is forbidden', 403);
  }

  const following = await user.following;
  if (!following.some(user => user.id === userToFollow.id)) {
    following.push(userToFollow);
    await repo.validateAndSave(user);
  }

  if (req.query.redirect) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect(`/profile/${encodeURIComponent(userToFollow.username)}`);
  }
});

router.post('/:username/unfollow', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(UserRepository);
  const user = req.user as User;
  const userToUnfollow = await repo.findByUsername(req.params.username);

  if (userToUnfollow === undefined) {
    throw new StatusError('User Not Found', 404);
  }

  const following = await user.following;
  const index = following.findIndex(user => user.id === userToUnfollow.id);
  if (index > -1) {
    following.splice(index, 1);
    await repo.validateAndSave(user);
  }

  if (req.query.redirect) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect(`/profile/${encodeURIComponent(userToUnfollow.username)}`);
  }
});

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
  });
});

export default router;
