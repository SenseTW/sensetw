import * as express from 'express';
import * as fs from 'async-file';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import PromiseRouter from 'express-promise-router';
import * as ReactDOMServer from 'react-dom/server';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import oauth, { hypothesisClient, revokeUserToken } from './oauth';
import { Context } from '../context';
import passport = require('./passport');
import * as U from '../types/user';
import { passLoggedIn, requireLoggedIn } from './redirect';

async function render(component, props = {}) {
  const html = ReactDOMServer.renderToStaticMarkup(component(props));
  const data = await fs.readFile(__dirname + '/../../public/index.html', 'utf8');
  const document = data.replace(/<body>[\s\S]*<\/body>/, `<body>${html}</body>`);
  return document;
}

export function router(context: Context) {
  const router = PromiseRouter();
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(cookieParser());
  router.use(express.static('public'));

  router.get('/login-success', requireLoggedIn(), async (req, res) => {
    return res.redirect(`/oauth/authorize?client_id=${hypothesisClient.id}&state=login&response_type=code`);
  });

  router.get('/login', passLoggedIn(), async (req, res) => {
    res.send(await render(LoginPage));
  });

  router.post('/login',
    passLoggedIn(),
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid e-mail or password',
      successFlash: 'Welcome!',
    }),
    async (req, res) => {
      if (req.query.next) {
        return res.redirect(req.query.next);
      }
      return res.redirect('/login-success');
    }
  );

  router.get('/signup', passLoggedIn(), async (req, res) => {
    const messages = {
      error: req.flash('error'),
      usernameError: req.flash('usernameError'),
      passwordError: req.flash('passwordError'),
      emailError: req.flash('emailError'),
    };
    res.send(await render(SignUpPage, { messages }));
  });

  router.post('/signup', passLoggedIn(), async (req, res) => {
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

    const passwordMsg = U.checkPassword(password);
    if (passwordMsg !== '') {
      req.flash('passwordError', passwordMsg);
      return res.redirect('/signup');
    }

    const { db } = context({ req });
    await U.createUser(db, { username, email }, password);
    res.redirect('/login');
  });

  router.get('/logout', async (req, res) => {
    req.logout();
    return res.redirect('/login');
  });

  router.all('/oauth/authorize',
    requireLoggedIn(),
    oauth.authorize({
      authenticateHandler: {
        handle: async (req, res) => {
          const { db } = context({ req });
          return U.getUser(db, req.user.id);
        },
      },
    }),
  );
  router.post('/h/token', (req, res, next) => {
    const { env } = context({ req });
    // XXX to support web_message response_type
    req.query.redirect_uri = `${env.PUBLIC_URL}/oauth/web_message`;
    next();
  }, oauth.token());
  router.all('/oauth/revoke',
    requireLoggedIn(),
    async (req, res) => {
      await revokeUserToken(req.user);
      req.logout();
      res.send('{}');
    });

  router.get('/oauth/web_message',
    requireLoggedIn(),
    async (req, res) => {
      const { env } = context({ req });
      const { code, origin = env.PUBLIC_URL, state } = req.query;
      res.render('authorize_web_message', { code, origin, state });
    }
  );

  return router;
}
