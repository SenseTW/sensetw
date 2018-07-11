import * as express from 'express';
import { Context } from '../context';

export function router(context: Context) {
  const router = express.Router()
  const { env } = context();

  return router;
}
