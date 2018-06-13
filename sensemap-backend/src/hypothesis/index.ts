import * as express from 'express';
import { router as rootRouter } from './root';
import { router as linksRouter } from './links';
import { router as profileRouter } from './profile';
import { router as searchRouter } from './search';
import { Context } from '../context';

export type MiddlewareConfig = {
  context: Context;
};

export function Middleware(config: MiddlewareConfig) {
  const router = express.Router();
  router.get('/ping', (req, res, next) => res.send('pong'));
  router.use('/', rootRouter(config));
  router.use('/links', linksRouter(config));
  router.use('/profile', profileRouter(config));
  router.use('/search', searchRouter(config));
  return router;
}
