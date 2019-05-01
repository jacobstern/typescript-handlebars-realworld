import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('home/index', {
    title: 'Home',
    nav: { home: true },
  });
});

export default router;