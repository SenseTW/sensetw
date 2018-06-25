import * as dotenv from 'dotenv';
dotenv.config()

import * as Knex from 'knex';
import { development } from '../knexfile';

const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: !!process.env.DEBUG,
  seeds: {
    directory: './seeds/dev',
  },
});

export const context = ({ req }) => ({
  db: knex,
});

export type Context = typeof context;
