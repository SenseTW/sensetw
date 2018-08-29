import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import Router from 'express-promise-router';
import { render } from './react-render';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgetPasswordPage from './components/ForgetPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import oauth, { hypothesisClient, revokeUserToken } from './oauth';
import { Context } from '../context';
import passport = require('./passport');
import * as U from '../types/user';
import { bypassAuthenticated, requireAuthentication } from './redirect';
import * as isemail from 'isemail';

export function router(context: Context) {
  const router = Router();
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(cookieParser());
  router.use(express.static('public'));

  router.get('/login', bypassAuthenticated(), async (req, res) => {
    const messages = {
      error: req.flash('error'),
    };
    res.send(await render(LoginPage, { messages }));
  });

  router.post('/login',
    bypassAuthenticated(),
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid e-mail or password',
      successFlash: 'Welcome!',
    }),
    async (req, res) => {
      if (req.query.next) {
        return res.redirect(req.query.next);
      }
      return res.redirect('/oauth/success');
    }
  );

  router.get('/signup', bypassAuthenticated(), async (req, res) => {
    const messages = {
      error: req.flash('error'),
      usernameError: req.flash('usernameError'),
      passwordError: req.flash('passwordError'),
      emailError: req.flash('emailError'),
    };
    res.send(await render(SignUpPage, { messages }));
  });

  router.post('/signup', bypassAuthenticated(), async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.email) {
      req.flash('error', 'Invalid form data.');
      return res.redirect('/signup');
    }

    const { username, password } = req.body;
    const email = req.body.email.toLowerCase();

    const usernameMsg = U.checkUsername(username);
    if (usernameMsg !== '') {
      req.flash('usernameError', usernameMsg);
      return res.redirect('/signup');
    }

    if (!isemail.validate(email)) {
      req.flash('emailError', 'Email must be a valid Email');
      return res.redirect('/signup');
    }

    const passwordMsg = U.checkPassword(password);
    if (passwordMsg !== '') {
      req.flash('passwordError', passwordMsg);
      return res.redirect('/signup');
    }

    const { db } = context({ req });

    if (await U.findUserByUsername(db, username)) {
      req.flash('usernameError', 'Sorry, an account with this username already exists.');
      return res.redirect('/signup');
    }

    if (await U.findUserByEmail(db, email)) {
      req.flash('emailError', 'Sorry, an account with this email address already exists.');
      return res.redirect('/signup');
    }

    await U.createUser(db, { username, email }, password);
    res.redirect('/login');
  });

  router.get(
    '/forget-password',
    bypassAuthenticated(),
    async (req, res) => {
      const messages = {
        emailError: req.flash('emailError'),
      };
      return res.send(await render(ForgetPasswordPage, { messages }));
    });

  router.post(
    '/forget-password',
    bypassAuthenticated(),
    async (req, res) => {
      const { db } = context({ req });
      const email = req.body.email.toLowerCase();
      if (!isemail.validate(email)) {
        req.flash('emailError', 'Email must be a valid Email');
        return res.redirect('/forget-password');
      }

      const user = await U.findUserByEmail(db, email);
      if (!user) {
        req.flash('emailError', 'Sorry, an account with this email address does not exist.');
        return res.redirect('/forget-password');
      }

      const token = await U.createResetPasswordToken(db, user.id);
      console.log(token);
      // XXX send email

      return res.send(await render(ForgetPasswordPage, { type: 'RESULT' }));
    });

  router.get(
    '/reset-password',
    bypassAuthenticated(),
    async (req, res) => {
      const token = req.query.token;
      if (!token) {
        return res.redirect('/login');
      }

      const { db } = context({ req });
      const u = await U.findUserByResetPasswordToken(db, token);
      if (!u) {
        return res.redirect('/login');
      }

      const messages = {
        passwordError: req.flash('passwordError'),
      };

      return res.send(await render(ResetPasswordPage, { token, messages }));
    });

  router.post(
    '/reset-password',
    bypassAuthenticated(),
    async (req, res) => {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.redirect('/login');
      }

      const { db } = context({ req });
      const u = await U.findUserByResetPasswordToken(db, token);
      if (!u) {
        return res.redirect('/login');
      }

      const passwordMsg = U.checkPassword(password);
      if (passwordMsg !== '') {
        req.flash('passwordError', passwordMsg);
        return res.redirect(`/reset-password?token=${token}`);
      }

      await U.updateUserPassword(db, u.id, password);
      await U.clearResetPasswordTokensForUser(db, u.id);

      return res.send(await render(ResetPasswordPage, { type: 'RESULT' }));
    });

  router.get('/logout', async (req, res) => {
    req.logout();
    return res.redirect('/login');
  });

  router.post('/h/token', (req, res, next) => {
    const { env } = context({ req });
    // XXX to support web_message response_type
    req.query.redirect_uri = `${env.PUBLIC_URL}/oauth/web_message`;
    next();
  }, oauth.token());

  router.all('/oauth/authorize',
    requireAuthentication(),
    oauth.authorize({
      authenticateHandler: {
        handle: async (req, res) => {
          const { db } = context({ req });
          return U.getUser(db, req.user.id);
        },
      },
    }),
  );

  router.get('/oauth/success', requireAuthentication(), async (req, res) => {
    return res.redirect(`/oauth/authorize?client_id=${hypothesisClient.id}&state=login&response_type=code`);
  });
  router.all('/oauth/revoke',
    requireAuthentication(),
    async (req, res) => {
      await revokeUserToken(req.user);
      req.logout();
      res.send('{}');
    });

  router.get('/oauth/web_message',
    requireAuthentication(),
    async (req, res) => {
      const { env } = context({ req });
      const { code, origin = env.PUBLIC_URL, state } = req.query;
      res.render('authorize_web_message', { code, origin, state });
    }
  );

  return router;
}
