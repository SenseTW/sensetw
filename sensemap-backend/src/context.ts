import * as Knex from 'knex';

const knex = Knex({
  client: 'pg',
  debug: !!process.env.DEBUG,
  connection: process.env.DATABASE_URL,
});

export const context = ({ req }) => ({
  db: knex,
});
