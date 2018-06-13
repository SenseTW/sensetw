import * as express from 'express';
import { MiddlewareConfig } from '.';

export function router(config: MiddlewareConfig) {
  const router = express.Router();
  router.get('/', (req, res) => res.sendStatus(200));
  return router;
}
