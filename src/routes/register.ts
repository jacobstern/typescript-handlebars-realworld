import express, { Request, Response } from 'express';
import { createUser } from '../services/accounts';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('register/index', {
    title: 'Sign up',
    nav: { register: true },
  });
});

router.post('/', async (req: Request, res: Response) => {
  await createUser(req.body);
  res.redirect('/');
});

export default router;
