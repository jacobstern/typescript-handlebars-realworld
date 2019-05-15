import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { isValidationErrorArray, collectErrorMessages } from '../utils/validation-errors';
import { NextFunction } from 'connect';

const router = express.Router();

router.get('/', ensureLoggedIn(), (req: Request, res: Response) => {
  res.render('settings.hbs', {
    title: 'Settings',
    nav: { settings: true },
    profile: req.user,
  });
});

interface PostBody {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  image?: string;
}

router.post('/', ensureLoggedIn(), async (req: Request, res: Response) => {
  const repo = req.entityManager.getCustomRepository(UserRepository);
  const user = req.user as User;
  const postBody = req.body as PostBody;
  ['username', 'email', 'password', 'bio', 'image'].forEach(key => {
    const formValue = postBody[key as keyof PostBody];
    // Ignore missing and empty string
    if (formValue) {
      user[key as keyof User] = formValue;
    }
  });
  try {
    await repo.validateAndSave(user);
    res.redirect(`/profile/${encodeURIComponent(user.username)}`);
  } catch (e) {
    if (isValidationErrorArray(e)) {
      res.render('settings.hbs', {
        title: 'Settings',
        nav: { settings: true },
        errorMessages: collectErrorMessages(e),
        profile: req.body,
      });
    } else {
      throw e;
    }
  }
});

router.get('/logout', ensureLoggedIn(), (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
});

export default router;
