import express, { Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import { UserUpdatesForm } from '../forms/UserForm';
import { updateUser } from '../services/accounts';
import { User } from '../entities/User';
import { MultiValidationError } from '../forms/MultiValidationError';
import { getEntityUpdates } from '../utils/get-entity-updates';
import { emptyToOptional } from '../utils/empty-to-optional';
import { collectErrorMessages } from '../utils/collect-error-messages';

const router = express.Router();

router.get('/', ensureLoggedIn(), (req: Request, res: Response) => {
  res.render('settings', {
    title: 'Settings',
    nav: { settings: true },
    user: req.user,
  });
});

router.post('/', ensureLoggedIn(), async (req: Request, res: Response) => {
  const updates = getEntityUpdates(req.user as User, emptyToOptional(req.body));
  try {
    const form = await UserUpdatesForm.validate(updates);
    await updateUser(req.user.id, form);
    res.redirect('/profile');
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
