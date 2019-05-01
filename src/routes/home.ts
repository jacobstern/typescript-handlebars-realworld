import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('home/index', {
    title: 'Home',
    nav: { home: true },
    user: req.user,
  });
});

export default router;
