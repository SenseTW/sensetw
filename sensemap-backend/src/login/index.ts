import * as express from 'express';
import * as fs from 'async-file';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import PromiseRouter from 'express-promise-router';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import { Context } from '../context';
import passport = require('./passport');
import * as U from '../types/user';
import { loggedIn, notLoggedIn } from './redirect';

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

  router.get('/login-success', notLoggedIn(), async (req, res) => {
    // TODO follow-up OAuth redirects
    console.log(req.flash('success'));
    return res.send('Success!');
  });

  router.get('/login', loggedIn(), async (req, res) => {
    console.log(req.flash('error'));
    res.send(await render(LoginPage));
  });

  router.post('/login',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid e-mail or password',
      successFlash: 'Welcome!',
    }),
    loggedIn()
  );

  router.get('/signup', loggedIn(), async (req, res) => {
    const messages = {
      error: req.flash('error'),
      usernameError: req.flash('usernameError'),
      passwordError: req.flash('passwordError'),
      emailError: req.flash('emailError'),
    };
    res.send(await render(SignUpPage, { messages }));
  });

  router.post('/signup', loggedIn(), async (req, res) => {
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
    const u = await U.createUser(db, { username, email }, password);
    res.redirect('/login');
  });

  router.get('/logout', async (req, res) => {
    req.logout();
    return res.redirect('/login');
  });

  return router;
}
