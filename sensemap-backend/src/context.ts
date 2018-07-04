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
  debug: !!process.env.DEBUG,
  public_url: process.env.PUBLIC_URL || 'https://api.sense.tw/',
  secret: process.env.SECRET || 'Wush8je7kee0faileir3sohy0tai4Chee7ua5ahrah0LaG1mui6iepieg0looque',
});

export type Context = typeof context;
