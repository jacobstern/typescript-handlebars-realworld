import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { isValidationErrorArray, collectErrorMessages } from '../utils/validation-errors';

const router = express.Router();

router.get('/', ensureLoggedIn(), (req: Request, res: Response) => {
  res.render('settings', {
    title: 'Settings',
    nav: { settings: true },
    user: req.user,
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
      res.render('settings', {
        title: 'Settings',
        nav: { settings: true },
        errorMessages: collectErrorMessages(e),
        user: req.body,
      });
    } else {
      throw e;
    }
  }
});

router.post('/logout', ensureLoggedIn(), (req: Request, res: Response) => {
  req.logout();
  res.redirect('/');
});

export default router;
