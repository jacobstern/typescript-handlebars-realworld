import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import { UserUpdatesForm } from '../forms/UserForm';
import { updateUser } from '../services/accounts';
import { MultiValidationError } from '../forms/MultiValidationError';
import { emptyToOptional } from '../utils/empty-to-optional';
import { collectErrorMessages } from '../utils/collect-error-messages';
import { User } from '../entities/User';

const router = express.Router();

router.get('/', ensureLoggedIn(), (req: Request, res: Response) => {
  res.render('settings', {
    title: 'Settings',
    nav: { settings: true },
    user: req.user,
  });
});

router.post('/', ensureLoggedIn(), async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const updates = emptyToOptional(req.body);
    const form = await UserUpdatesForm.validate(user, updates);
    await updateUser(user, form);
    res.redirect(`/profile/${encodeURIComponent(user.username)}`);
  } catch (e) {
    if (e instanceof MultiValidationError) {
      res.render('settings', {
        title: 'Settings',
        nav: { settings: true },
        errorMessages: collectErrorMessages(e.errors),
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
