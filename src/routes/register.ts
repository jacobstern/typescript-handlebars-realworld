import express, { Request, Response } from 'express';
import { createUser } from '../services/accounts';
import { RegisterForm } from '../forms/RegisterForm';
import { MultiValidationError } from '../forms/MultiValidationError';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('register/index', {
    title: 'Sign up',
    nav: { register: true },
  });
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const form = await RegisterForm.validate(req.body);
    await createUser(form);
    res.redirect('/');
  } catch (e) {
    if (e instanceof MultiValidationError) {
      // TODO
    } else {
      throw e;
    }
  }
});

export default router;
