import * as Knex from 'knex';
import { development } from '../knexfile';

const knex = Knex({
  ...development,
  debug: !!process.env.DEBUG,
});

export const context = ({ req }) => ({
  db: knex,
});

export type Context = typeof context;
