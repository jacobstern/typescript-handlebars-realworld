import express, { Request, Response } from 'express';
import { listPopularTags } from '../services/articles';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const popularTags = await listPopularTags();
  res.render('home', {
    title: 'Home',
    nav: { home: true },
    user: req.user,
    popularTags: popularTags.map(tag => ({
      tagName: tag,
      url: `/home?tag=${encodeURIComponent(tag)}`,
    })),
  });
});

export default router;
