import * as express from 'express';
import { Context } from '../context';

export function router(context: Context) {
  const router = express.Router();
  router.get('/', (req, res) => res.sendStatus(200));
  return router;
}
