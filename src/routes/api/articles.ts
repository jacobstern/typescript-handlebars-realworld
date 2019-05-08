import express, { Request, Response } from 'express';
import { StatusError } from '../../errors';
import { User } from '../../entities/User';
import { ArticleRepository } from '../../repositories/ArticleRepository';
import { UserRepository } from '../../repositories/UserRepository';

const router = express.Router();

router.post('/:slug/favorite', async (req: Request, res: Response) => {
  const articleRepo = req.entityManager.getCustomRepository(ArticleRepository);
  const userRepo = req.entityManager.getCustomRepository(UserRepository);

  const user = req.user as User;
  if (user == null) {
    throw new StatusError('User not authenticated', 401);
  }

  const article = await articleRepo.findBySlug(req.params.slug);
  if (article == null) {
    throw new StatusError('Article not found', 404);
  }

  const favorites = await user.favorites;
  if (!favorites.some(favorite => favorite.id === article.id)) {
    favorites.push(article);

    await userRepo.validateAndSave(user);

    article.favoritesCount += 1;
    await articleRepo.validateAndSave(article);
  }

  res.json({
    article: {
      ...article,
      favorited: true,
    },
  });
});

router.delete('/:slug/favorite', async (req: Request, res: Response) => {
  const articleRepo = req.entityManager.getCustomRepository(ArticleRepository);
  const userRepo = req.entityManager.getCustomRepository(UserRepository);

  const user = req.user as User;
  if (user == null) {
    throw new StatusError('User not authenticated', 401);
  }

  const article = await articleRepo.findBySlug(req.params.slug);
  if (article == null) {
    throw new StatusError('Article not found', 404);
  }

  const favorites = await user.favorites;
  const index = favorites.findIndex(favorite => favorite.id === article.id);
  if (index > -1) {
    favorites.splice(index, 1);

    await userRepo.validateAndSave(user);

    article.favoritesCount -= 1;
    await articleRepo.validateAndSave(article);
  }

  res.json({
    article: {
      ...article,
      favorited: false,
    },
  });
});

export default router;
