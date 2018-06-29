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

async function render(component) {
  const html = ReactDOMServer.renderToStaticMarkup(component({}));
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
    console.log(req.user);
    return res.send('Success!');
  });

  router.get('/login', loggedIn(), async (req, res) => {
    res.send(await render(LoginPage));
  });

  router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    loggedIn()
  );

  router.get('/signup', loggedIn(), async (req, res) => {
    res.send(await render(SignUpPage));
  });

  router.post('/signup', loggedIn(), async (req, res) => {
    const { db } = context({ req });
    const { username, password, email } = req.body;
    const u = await U.createUser(db, { username, email }, password);
    res.redirect('/login');
  });

  router.get('/logout', async (req, res) => {
    req.logout();
    return res.redirect('/login');
  });

  return router;
}
