import * as dotenv from 'dotenv';
dotenv.config()

import * as Knex from 'knex';

function noSlash(a: string): string {
  return a.replace(/\/+$/, '');
}

const env = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: noSlash(process.env.DATABASE_URL),
  SESSION_SECRET: process.env.SESSION_SECRET || 'Wush8je7kee0faileir3sohy0tai4Chee7ua5ahrah0LaG1mui6iepieg0looque',
  CLIENT_JS_URL: noSlash(process.env.CLIENT_URL || 'https://sense.tw/embed.js'),
  CLIENT_OAUTH_ID: noSlash(process.env.CLIENT_OAUTH_ID || '00e468bc-c948-11e7-9ada-33c411fb1c8a'),
  PUBLIC_URL: noSlash(process.env.PUBLIC_URL || 'https://api.sense.tw'),
  SENSEMAP_API_ROOT: noSlash(process.env.SENSEMAP_API_ROOT || 'https://api.sense.tw/graphql'),
  HYPOTHESIS_API_ROOT: noSlash(process.env.HYPOTHESIS_API_ROOT || 'https://api.sense.tw/h/api'),
  PUBLIC_MAP_ID: process.env.PUBLIC_MAP_ID || '1dbab857-942d-41d0-baa1-82fa70b0d773',
  VIA_URL: process.env.VIA_URL || 'https://via.sense.tw',
  MAILGUN_HOST: process.env.MAILGUN_HOST || 'smtp.mailgun.org',
  MAILGUN_PORT: process.env.MAILGUN_PORT || 465,
  MAILGUN_USER: process.env.MAILGUN_USER,
  MAILGUN_PASS: process.env.MAILGUN_PASS,
  MAILGUN_NAME: process.env.MAILGUN_NAME || 'sense.tw',
};

const db = Knex({
  client: 'pg',
  connection: env.DATABASE_URL,
  //debug: env.NODE_ENV === 'development',
  seeds: {
    directory: './seeds/dev',
  },
});

export const context = ({ req = null } = {}) => {
  const authorization = !!req ? req.headers.authorization : null;
  return { db, env, authorization };
};

export type Context = typeof context;
