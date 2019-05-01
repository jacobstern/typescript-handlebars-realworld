import express, { Request, Response } from 'express';
import { createUser } from '../services/accounts';
import { RegisterForm } from '../forms/RegisterForm';
import { MultiValidationError } from '../forms/MultiValidationError';
import { collectErrorMessages } from '../collect-error-messages';

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
      res.render('register/index', {
        title: 'Sign up',
        nav: { register: true },
        errorMessages: collectErrorMessages(e.errors),
        register: req.body,
      });
    } else {
      throw e;
    }
  }
});

export default router;
