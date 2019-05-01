import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('login', {
    title: 'Sign in',
    nav: { login: true },
    errorMessages: req.flash('error'),
  });
});

router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'email or password was not valid',
  })
);

export default router;
