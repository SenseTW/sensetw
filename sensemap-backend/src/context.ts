import * as Knex from 'knex';
import { development } from '../knexfile';

const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: !!process.env.DEBUG,
});

export const context = ({ req }) => ({
  db: knex,
});

export type Context = typeof context;
