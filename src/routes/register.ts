import express, { Request, Response } from 'express';
import { createUser } from '../services/accounts';
import { UserForm } from '../forms/UserForm';
import { MultiValidationError } from '../forms/MultiValidationError';
import { collectErrorMessages } from '../collect-error-messages';
import { NextFunction } from 'connect';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('register/index', {
    title: 'Sign up',
    nav: { register: true },
  });
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await UserForm.validate(req.body);
    const user = await createUser(form);
    req.login(user, err => {
      if (err) {
        next(err);
      }
      res.redirect('/');
    });
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
