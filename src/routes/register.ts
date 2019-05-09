import express, { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { isValidationErrorArray, collectErrorMessages } from '../utils/validation-errors';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('register/index', {
    title: 'Sign up',
    nav: { register: true },
  });
});

interface PostBody {
  username: string;
  email: string;
  password: string;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const repo = req.entityManager.getCustomRepository(UserRepository);
  const postBody = req.body as PostBody;
  const user = new User();
  user.username = postBody.username;
  user.email = postBody.email;
  user.password = postBody.password;
  try {
    await repo.validateAndSave(user);
    req.login(user, err => {
      if (err) {
        next(err);
      }
      res.redirect('/');
    });
  } catch (e) {
    if (isValidationErrorArray(e)) {
      res.render('register/index', {
        title: 'Sign up',
        nav: { register: true },
        errorMessages: collectErrorMessages(e),
        register: req.body,
      });
    } else {
      throw e;
    }
  }
});

export default router;
