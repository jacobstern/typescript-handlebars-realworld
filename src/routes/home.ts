import express, { Request, Response } from 'express';
import { listPopularTags, listArticles } from '../services/articles';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const popularTags = await listPopularTags();
  const { articles, count: articlesCount } = await listArticles();

  res.render('home', {
    title: 'Home',
    nav: { home: true },
    user: req.user,
    popularTags,
    articles,
  });
});

export default router;
