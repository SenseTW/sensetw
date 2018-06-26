import * as dotenv from 'dotenv';
dotenv.config()

import * as Knex from 'knex';
import * as config from '../config';

const knex = Knex(
  !!process.env.NODE_ENV && process.env.NODE_ENV in config
    ? config[process.env.NODE_ENV]
    : {
      client: 'pg',
      connection: process.env.DATABASE_URL,
    });

export const context = ({ req }) => ({
  db: knex,
});

export type Context = typeof context;
